// Typed wrappers over the Rust core's Tauri commands (src-tauri/src).
import { Channel, invoke } from "@tauri-apps/api/core";

export interface HttpRequest {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  /** Header values may contain `{{secret:NAME}}`; Rust substitutes from the OS keychain. */
  headers?: Record<string, string>;
  body?: string;
  timeout_ms?: number;
  /** Accepted for Scout compatibility; this app's Rust layer never retries. */
  retries?: number;
}
export interface HttpResponse { status: number; body: string }
export const http = (req: HttpRequest) => invoke<HttpResponse>("http_request", { req });

/** Streams a 2xx body to onChunk; on non-2xx nothing is streamed and the error body is in `body`. */
export async function httpStream(req: HttpRequest, onChunk: (text: string) => void): Promise<HttpResponse> {
  let ended!: () => void;
  const end = new Promise<void>((r) => (ended = r));
  const ch = new Channel<string>();
  ch.onmessage = (t) => (t === "" ? ended() : onChunk(t));
  const res = await invoke<HttpResponse>("http_stream", { req, onChunk: ch });
  if (res.status >= 200 && res.status < 300) await end;
  return res;
}

export const secrets = {
  set: (name: string, value: string) => invoke<void>("secret_set", { name, value }),
  delete: (name: string) => invoke<void>("secret_delete", { name }),
  exists: (name: string) => invoke<boolean>("secret_exists", { name }),
};

export interface CliResult { code: number; stdout: string; stderr: string }
export const runCli = (program: string, args: string[], stdin: string, timeout_ms = 600_000) =>
  invoke<CliResult>("run_cli", { program, args, stdin, timeoutMs: timeout_ms });

export type OAuthProviderId = "openai-codex";
export type OAuthEvent = { kind: "browser"; url: string };
export interface OAuthStatus { signed_in: boolean; expires_at: number | null; account: string | null; registered: boolean }
export interface OAuthEnsured { expires_at: number; bearer: string }
export const oauth = {
  login(provider: OAuthProviderId, onEvent: (e: OAuthEvent) => void) {
    const ch = new Channel<OAuthEvent>();
    ch.onmessage = onEvent;
    return invoke<OAuthStatus>("oauth_login", { provider, onEvent: ch });
  },
  cancel: (provider: OAuthProviderId) => invoke<void>("oauth_cancel", { provider }),
  ensure: (provider: OAuthProviderId) => invoke<OAuthEnsured>("oauth_ensure", { provider }),
  status: (provider: OAuthProviderId) => invoke<OAuthStatus>("oauth_status", { provider }),
  logout: (provider: OAuthProviderId, forget = false) => invoke<boolean>("oauth_logout", { provider, forget }),
};

export interface HwInfo { gpus: { name: string; vendor: "nvidia" | "amd" | "intel" | "other"; vram_bytes: number }[]; ram_bytes: number; cpus: number }
export const hwInfo = () => invoke<HwInfo>("hw_info");

export interface TtsStatus { uv: boolean; installed: ("gpu" | "cpu")[]; running: number | null; dir: string }
export const tts = {
  status: () => invoke<TtsStatus>("tts_status"),
  setup(mode: "gpu" | "cpu", onLog: (line: string) => void) {
    const ch = new Channel<string>();
    ch.onmessage = onLog;
    return invoke<void>("tts_setup", { mode, log: ch });
  },
  start: (mode: "gpu" | "cpu", model: string, device: "cuda" | "cpu") => invoke<number>("tts_start", { mode, model, device }),
  stop: () => invoke<void>("tts_stop"),
  installUv: () => invoke<void>("install_uv"),
};

export const inTauri = () => "__TAURI_INTERNALS__" in window;
