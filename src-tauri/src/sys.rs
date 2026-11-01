use serde::Serialize;
use std::{path::PathBuf, process::Stdio, sync::Mutex, time::Duration};
use tauri::{AppHandle, Manager, State, ipc::Channel};
use tokio::{
    io::{AsyncBufReadExt, AsyncWriteExt, BufReader},
    process::Command,
};

#[cfg(windows)]
const NO_WINDOW: u32 = 0x0800_0000; // CREATE_NO_WINDOW

fn err(e: impl std::fmt::Display) -> String {
    e.to_string()
}

fn hide_console(c: &mut Command) -> &mut Command {
    #[cfg(windows)]
    c.creation_flags(NO_WINDOW);
    c
}

// ---- secrets ----

pub fn secret_entry(name: &str) -> Result<keyring::Entry, String> {
    keyring::Entry::new("io.deforge.reacttutor", name).map_err(err)
}

#[tauri::command(async)]
pub fn secret_set(name: String, value: String) -> Result<(), String> {
    secret_entry(&name)?.set_password(&value).map_err(err)
}

#[tauri::command(async)]
pub fn secret_delete(name: String) -> Result<(), String> {
    match secret_entry(&name)?.delete_credential() {
        Ok(()) | Err(keyring::Error::NoEntry) => Ok(()),
        Err(e) => Err(err(e)),
    }
}

#[tauri::command(async)]
pub fn secret_exists(name: String) -> Result<bool, String> {
    match secret_entry(&name)?.get_password() {
        Ok(_) => Ok(true),
        Err(keyring::Error::NoEntry) => Ok(false),
        Err(e) => Err(err(e)),
    }
}

// ---- CLI bridge (Claude Code / Codex CLI the student is already signed in to) ----

#[derive(Serialize)]
pub struct CliResult {
    code: i32,
    stdout: String,
    stderr: String,
}

fn resolve(program: &str) -> Option<PathBuf> {
    let exts: &[&str] = if cfg!(windows) { &["exe", "cmd"] } else { &[""] };
    std::env::split_paths(&std::env::var_os("PATH")?)
        .flat_map(|d| exts.iter().map(move |e| d.join(program).with_extension(e)))
        .find(|p| p.is_file())
}

#[tauri::command]
pub async fn run_cli(program: String, args: Vec<String>, stdin: String, timeout_ms: u64) -> Result<CliResult, String> {
    if !["claude", "codex"].contains(&program.as_str()) {
        return Err(format!("program not allowed: {program}"));
    }
    let path = resolve(&program).ok_or_else(|| format!("{program} not found on PATH"))?;
    // neutral cwd so the CLI doesn't pick up CLAUDE.md/AGENTS.md from wherever the app was launched
    let cwd = std::env::temp_dir().join("reacttutor-cli");
    std::fs::create_dir_all(&cwd).map_err(err)?;
    let mut cmd = Command::new(path);
    cmd.current_dir(cwd).args(&args).stdin(Stdio::piped()).stdout(Stdio::piped()).stderr(Stdio::piped()).kill_on_drop(true);
    let mut child = hide_console(&mut cmd).spawn().map_err(err)?;
    let mut si = child.stdin.take().unwrap();
    let write = async move {
        let _ = si.write_all(stdin.as_bytes()).await; // child may exit without reading
        drop(si);
    };
    let (_, out) = tokio::time::timeout(Duration::from_millis(timeout_ms), async { tokio::join!(write, child.wait_with_output()) })
        .await
        .map_err(|_| format!("{program} timed out after {timeout_ms}ms"))?;
    let out = out.map_err(err)?;
    Ok(CliResult {
        code: out.status.code().unwrap_or(-1),
        stdout: String::from_utf8_lossy(&out.stdout).into_owned(),
        stderr: String::from_utf8_lossy(&out.stderr).into_owned(),
    })
}

// ---- hardware (picks the narration model) ----

#[derive(Serialize, Default)]
pub struct Gpu {
    name: String,
    vendor: &'static str,
    vram_bytes: u64,
}

#[derive(Serialize, Default)]
pub struct HwInfo {
    gpus: Vec<Gpu>,
    ram_bytes: u64,
    cpus: usize,
}

fn vendor_of(id: u32) -> &'static str {
    match id {
        0x10DE => "nvidia",
        0x1002 => "amd",
        0x8086 => "intel",
        _ => "other",
    }
}

#[cfg(windows)]
fn gpus_and_ram() -> (Vec<Gpu>, u64) {
    use windows::Win32::Graphics::Dxgi::{CreateDXGIFactory1, DXGI_ADAPTER_FLAG_SOFTWARE, IDXGIFactory1};
    use windows::Win32::System::SystemInformation::{GlobalMemoryStatusEx, MEMORYSTATUSEX};
    let mut gpus = vec![];
    // SAFETY: plain COM calls on objects we own; no pointers outlive this function
    unsafe {
        if let Ok(f) = CreateDXGIFactory1::<IDXGIFactory1>() {
            let mut i = 0;
            while let Ok(a) = f.EnumAdapters1(i) {
                i += 1;
                let Ok(d) = a.GetDesc1() else { continue };
                if d.Flags & DXGI_ADAPTER_FLAG_SOFTWARE.0 as u32 != 0 {
                    continue;
                }
                let n = d.Description.iter().position(|&c| c == 0).unwrap_or(d.Description.len());
                gpus.push(Gpu { name: String::from_utf16_lossy(&d.Description[..n]), vendor: vendor_of(d.VendorId), vram_bytes: d.DedicatedVideoMemory as u64 });
            }
        }
        let mut m = MEMORYSTATUSEX { dwLength: size_of::<MEMORYSTATUSEX>() as u32, ..Default::default() };
        let ram = if GlobalMemoryStatusEx(&mut m).is_ok() { m.ullTotalPhys } else { 0 };
        (gpus, ram)
    }
}

// shortcut: non-Windows reports no GPU (CPU narration model), add nvidia-smi / sysctl when other OS builds ship
#[cfg(not(windows))]
fn gpus_and_ram() -> (Vec<Gpu>, u64) {
    (vec![], 0)
}

#[tauri::command(async)]
pub fn hw_info() -> HwInfo {
    let (mut gpus, ram_bytes) = gpus_and_ram();
    let mut seen = std::collections::HashSet::new();
    gpus.retain(|g| seen.insert((g.name.clone(), g.vram_bytes))); // DXGI lists one GPU several times on some setups
    HwInfo { gpus, ram_bytes, cpus: std::thread::available_parallelism().map_or(1, |n| n.get()) }
}

// ---- narration (KittenTTS in a uv-managed Python venv, served on 127.0.0.1) ----

const SERVER_PY: &str = include_str!("../../tts/server.py");

#[derive(Default)]
pub struct Tts(Mutex<Option<(tokio::process::Child, u16)>>);

fn tts_dir(app: &AppHandle) -> Result<PathBuf, String> {
    let d = app.path().app_data_dir().map_err(err)?.join("tts");
    std::fs::create_dir_all(&d).map_err(err)?;
    Ok(d)
}

fn venv_python(dir: &std::path::Path, mode: &str) -> PathBuf {
    let v = dir.join(format!("venv-{mode}"));
    if cfg!(windows) { v.join("Scripts").join("python.exe") } else { v.join("bin").join("python") }
}

#[derive(Serialize)]
pub struct TtsStatus {
    uv: bool,
    installed: Vec<String>,
    running: Option<u16>,
    dir: String,
}

#[tauri::command]
pub fn tts_status(app: AppHandle, st: State<Tts>) -> Result<TtsStatus, String> {
    let dir = tts_dir(&app)?;
    let mut slot = st.0.lock().unwrap();
    if slot.as_mut().is_some_and(|(c, _)| !matches!(c.try_wait(), Ok(None))) {
        *slot = None;
    }
    Ok(TtsStatus {
        uv: resolve("uv").is_some(),
        installed: ["gpu", "cpu"].iter().filter(|m| dir.join(format!("venv-{m}")).join(".ready").exists()).map(|m| m.to_string()).collect(),
        running: slot.as_ref().map(|(_, p)| *p),
        dir: dir.to_string_lossy().into_owned(),
    })
}

async fn pipe<R: tokio::io::AsyncRead + Unpin>(r: R, log: &Channel<String>) {
    let mut lines = BufReader::new(r).lines();
    while let Ok(Some(l)) = lines.next_line().await {
        let _ = log.send(l);
    }
}

/// Runs one setup command, streaming its output lines to `log`.
async fn step(log: &Channel<String>, program: &PathBuf, args: &[&str]) -> Result<(), String> {
    let _ = log.send(format!("$ {} {}", program.file_name().unwrap_or_default().to_string_lossy(), args.join(" ")));
    let mut cmd = Command::new(program);
    cmd.args(args).stdout(Stdio::piped()).stderr(Stdio::piped()).kill_on_drop(true);
    let mut child = hide_console(&mut cmd).spawn().map_err(err)?;
    let (out, errs) = (child.stdout.take().unwrap(), child.stderr.take().unwrap());
    let (_, _, status) = tokio::join!(pipe(out, log), pipe(errs, log), child.wait());
    if status.map_err(err)?.success() { Ok(()) } else { Err(format!("setup step failed: {}", args.join(" "))) }
}

/// Creates the venv for `mode` ("gpu": CUDA PyTorch + Kitten TTS 2, "cpu": ONNX Kitten models) with uv.
#[tauri::command]
pub async fn tts_setup(app: AppHandle, mode: String, log: Channel<String>) -> Result<(), String> {
    if mode != "gpu" && mode != "cpu" {
        return Err("mode must be gpu or cpu".into());
    }
    let uv = resolve("uv").ok_or("uv was not found. Install it from the Narration settings, then try again.")?;
    let dir = tts_dir(&app)?;
    let venv = dir.join(format!("venv-{mode}"));
    let py = venv_python(&dir, &mode);
    let pys = py.to_string_lossy().into_owned();
    step(&log, &uv, &["venv", "--python", "3.12", "--allow-existing", &venv.to_string_lossy()]).await?;
    if mode == "gpu" {
        // PyPI torch is CPU-only on Windows; cu128 wheels include Blackwell (sm_120)
        step(&log, &uv, &["pip", "install", "--python", &pys, "torch", "--index-url", "https://download.pytorch.org/whl/cu128"]).await?;
    }
    step(&log, &uv, &["pip", "install", "--python", &pys, "kittenml", "soundfile"]).await?;
    std::fs::write(venv.join(".ready"), "").map_err(err)?;
    Ok(())
}

#[tauri::command]
pub async fn tts_start(app: AppHandle, st: State<'_, Tts>, mode: String, model: String, device: String) -> Result<u16, String> {
    stop_tts(&st);
    let dir = tts_dir(&app)?;
    let py = venv_python(&dir, &mode);
    if !py.exists() {
        return Err("Narration engine isn't installed yet.".into());
    }
    let script = dir.join("server.py");
    std::fs::write(&script, SERVER_PY).map_err(err)?;
    let cache = dir.join("cache");
    let mut cmd = Command::new(py);
    cmd.arg(&script)
        .args(["--model", &model, "--device", &device, "--port", "0", "--cache"])
        .arg(&cache)
        .env("PYTHONUNBUFFERED", "1")
        .env("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")
        .stdin(Stdio::piped()) // kept open in `Tts`; the server exits when it closes (app quit or crash)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true);
    let mut child = hide_console(&mut cmd).spawn().map_err(err)?;
    let mut lines = BufReader::new(child.stdout.take().unwrap()).lines();
    let mut errs = BufReader::new(child.stderr.take().unwrap()).lines();
    let tail = std::sync::Arc::new(Mutex::new(Vec::<String>::new()));
    let t2 = tail.clone();
    tokio::spawn(async move {
        while let Ok(Some(l)) = errs.next_line().await {
            let mut t = t2.lock().unwrap();
            t.push(l);
            let n = t.len();
            if n > 30 {
                t.drain(..n - 30);
            }
        }
    });
    // first start downloads the model, so allow a long wait for the READY line
    let port = tokio::time::timeout(Duration::from_secs(1800), async {
        while let Ok(Some(l)) = lines.next_line().await {
            if let Some(p) = l.strip_prefix("READY ") {
                return p.trim().parse::<u16>().ok();
            }
        }
        None
    })
    .await
    .ok()
    .flatten();
    let Some(port) = port else {
        let _ = child.kill().await;
        return Err(format!("Narration engine failed to start:\n{}", tail.lock().unwrap().join("\n")));
    };
    tokio::spawn(async move { while let Ok(Some(_)) = lines.next_line().await {} }); // keep stdout drained
    *st.0.lock().unwrap() = Some((child, port));
    Ok(port)
}

pub fn stop_tts(st: &Tts) {
    if let Some((mut c, _)) = st.0.lock().unwrap().take() {
        let _ = c.start_kill();
    }
}

#[tauri::command]
pub fn tts_stop(st: State<Tts>) {
    stop_tts(&st);
}

/// Opens the uv installer (official script) in a visible PowerShell window so the student sees what runs.
#[tauri::command]
pub async fn install_uv() -> Result<(), String> {
    let status = if cfg!(windows) {
        Command::new("powershell").args(["-ExecutionPolicy", "ByPass", "-c", "irm https://astral.sh/uv/install.ps1 | iex"]).status().await
    } else {
        Command::new("sh").args(["-c", "curl -LsSf https://astral.sh/uv/install.sh | sh"]).status().await
    };
    if !status.map_err(err)?.success() {
        return Err("uv installer failed".into());
    }
    // the installer adds uv to PATH for new processes only; make it visible to this one too
    if let Some(home) = std::env::var_os(if cfg!(windows) { "USERPROFILE" } else { "HOME" }) {
        let bin = PathBuf::from(home).join(".local").join("bin");
        let mut paths: Vec<PathBuf> = std::env::split_paths(&std::env::var_os("PATH").unwrap_or_default()).collect();
        if !paths.contains(&bin) {
            paths.push(bin);
            // SAFETY: PATH is only read when spawning tools; a racing reader just sees the old value
            unsafe { std::env::set_var("PATH", std::env::join_paths(paths).map_err(err)?) };
        }
    }
    Ok(())
}
