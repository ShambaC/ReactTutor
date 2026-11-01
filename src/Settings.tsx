import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Cpu, Loader2, Plus, RefreshCw, Trash2, Volume2 } from "lucide-react";
import { ai, listModels } from "./ai";
import { PROVIDER_PRESETS } from "./ai/providers/presets";
import { USAGE_URL, codexModels } from "./ai/providers/oauth";
import { oauth, secrets, type OAuthStatus } from "./ai/rust";
import type { ProviderConfig } from "./ai/types";
import { ENGINES, initNarration, narration, recommend, setupNarration, synth, browserSpeak, playClip } from "./narration";
import { errText, prefs, progress, type Prefs } from "./store";
import { Badge, Button, Card, Confirm, Field, Input, Select, Tabs } from "./ui";

const SECTIONS = [{ id: "ai", label: "AI tutor" }, { id: "voice", label: "Voice & microphone" }, { id: "look", label: "Appearance" }, { id: "progress", label: "Progress" }] as const;
type Sec = (typeof SECTIONS)[number]["id"];

const upProvider = (id: string, f: (p: ProviderConfig) => ProviderConfig) => ai.set((s) => ({ ...s, providers: s.providers.map((p) => (p.id === id ? f(p) : p)) }));

function ProviderCard({ p }: { p: ProviderConfig }) {
  const s = ai.use();
  const [key, setKey] = useState(""), [saved, setSaved] = useState(false), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const pr = PROVIDER_PRESETS.find((q) => q.id === p.id.replace(/-\d+$/, ""));
  const needsKey = p.kind === "openai_compat" || p.kind === "anthropic";
  const secret = p.secret_name ?? `reacttutor-${p.id}`;
  useEffect(() => { if (needsKey) secrets.exists(secret).then(setSaved).catch(() => setSaved(false)); }, [secret]);
  const saveKey = () => secrets.set(secret, key).then(() => { setKey(""); setSaved(true); upProvider(p.id, (x) => ({ ...x, secret_name: secret })); }).catch((e) => setErr(errText(e)));
  const load = async () => {
    setBusy(true); setErr("");
    try {
      const models = await listModels(p);
      ai.set((x) => ({ ...x, models: { ...x.models, [p.id]: models } }));
      if (!models.length) setErr("This provider didn't list any chat models. You can type a model name below.");
    } catch (e) { setErr(`Couldn't load models: ${errText(e)}`); }
    setBusy(false);
  };
  const models = s.models[p.id] ?? [];
  const [custom, setCustom] = useState("");
  const choose = (model: string) => ai.set((x) => ({ ...x, selected: { provider_id: p.id, model } }));
  return <Card className="space-y-3 p-3">
    <div className="flex items-center gap-2">
      <span className="flex-1 font-medium">{p.label}</span>
      <Badge className="font-mono">{p.kind === "oauth" ? "ChatGPT plan" : p.kind === "cli_bridge" ? "CLI" : p.kind}</Badge>
      <Button variant="ghost" size="icon" aria-label={`Remove ${p.label}`} onClick={() => ai.set((x) => ({ ...x, providers: x.providers.filter((q) => q.id !== p.id), selected: x.selected?.provider_id === p.id ? null : x.selected }))}><Trash2 size={14} /></Button>
    </div>
    {p.kind !== "cli_bridge" && p.kind !== "oauth" && <Field label="Base URL" hint={pr?.note}><Input value={p.base_url ?? ""} onChange={(e) => upProvider(p.id, (x) => ({ ...x, base_url: e.target.value }))} /></Field>}
    {needsKey && <Field label="API key" hint={`Stored in your computer's secure keychain; never shown again.${pr?.key_url ? ` Get one at ${pr.key_url}` : ""}`}>
      <div className="flex items-center gap-2"><Input type="password" autoComplete="off" placeholder={saved ? "replace key" : "paste key (leave empty if not needed)"} value={key} onChange={(e) => setKey(e.target.value)} />
        <Button disabled={!key} onClick={saveKey}>Save key</Button>{saved && <Badge tone="success"><Check size={11} />saved</Badge>}</div></Field>}
    <div className="space-y-2">
      <div className="flex items-center gap-2"><span className="text-xs font-medium text-muted">Models</span>
        <Button size="sm" onClick={load} disabled={busy}>{busy ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}Load models</Button></div>
      {models.length > 0 && <div className="flex max-h-48 flex-wrap gap-1.5 overflow-y-auto">{models.map((m) => {
        const on = s.selected?.provider_id === p.id && s.selected.model === m;
        return <button key={m} onClick={() => choose(m)} className={`rounded-md border px-2 py-1 font-mono text-[11px] cursor-pointer ${on ? "border-accent bg-accent/15 text-accent" : "border-border hover:border-accent"}`}>{on && "✓ "}{m}</button>;
      })}</div>}
      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (custom.trim()) { ai.set((x) => ({ ...x, models: { ...x.models, [p.id]: [...new Set([...(x.models[p.id] ?? []), custom.trim()])] } })); choose(custom.trim()); setCustom(""); } }}>
        <Input className="h-8 text-xs" placeholder="or type a model id" value={custom} onChange={(e) => setCustom(e.target.value)} /><Button size="sm" type="submit" disabled={!custom.trim()}>Use</Button></form>
    </div>
    {err && <div className="text-xs text-warning">{err}</div>}
  </Card>;
}

function ChatGptLogin() {
  const s = ai.use();
  const [st, setSt] = useState<OAuthStatus | null>(null), [busy, setBusy] = useState(false), [url, setUrl] = useState(""), [err, setErr] = useState("");
  const cancelled = useRef(false);
  const load = () => oauth.status("openai-codex").then(setSt).catch(() => setSt(null));
  useEffect(() => { load(); }, []);
  const added = s.providers.some((p) => p.kind === "oauth");
  const add = async () => {
    try {
      const ms = (await codexModels()).map((m) => m.slug);
      ai.set((x) => ({ ...x, providers: [...x.providers.filter((p) => p.kind !== "oauth"), { id: "chatgpt", kind: "oauth", oauth: "openai-codex", label: "ChatGPT plan", enabled: true }], models: { ...x.models, chatgpt: ms }, selected: x.selected ?? (ms[0] ? { provider_id: "chatgpt", model: ms[0] } : null) }));
    } catch (e) { setErr(errText(e)); }
  };
  const signIn = () => {
    cancelled.current = false; setBusy(true); setUrl(""); setErr("");
    oauth.login("openai-codex", (e) => setUrl(e.url))
      .then(async (x) => { setSt(x); await add(); })
      .catch((e) => { if (!cancelled.current) setErr(errText(e)); load(); })
      .finally(() => { setBusy(false); setUrl(""); });
  };
  return <Card className="space-y-2 p-3">
    <div className="font-medium">Use your ChatGPT subscription</div>
    <div className="text-xs text-muted">Sign in with ChatGPT and Kit will use the usage included in your ChatGPT plan. React Tutor adds no charge. Sign-in tokens stay in your computer's keychain. Manage usage at {USAGE_URL}</div>
    <div className="flex flex-wrap items-center gap-2">
      {st?.signed_in && <Badge tone="success"><Check size={11} />Signed in{st.account ? `: ${st.account}` : ""}</Badge>}
      {st?.signed_in && !added && <Button size="sm" onClick={add}>Add as provider</Button>}
      {busy ? <Button size="sm" onClick={() => { cancelled.current = true; oauth.cancel("openai-codex").catch(() => {}); }}>Cancel</Button>
        : st?.signed_in ? <Button size="sm" onClick={() => oauth.logout("openai-codex").then(load)}>Sign out</Button>
        : <Button size="sm" className="border-black bg-black text-white hover:bg-black/80" onClick={signIn}>Continue with ChatGPT</Button>}
    </div>
    {busy && <div className="text-xs text-muted">{url ? <>Finish signing in in your web browser. If it didn't open, copy this link: <code className="select-text break-all">{url}</code></> : "Starting…"}</div>}
    {err && <div className="text-xs text-warning">{err}</div>}
  </Card>;
}

function AiSection() {
  const s = ai.use();
  const [cliWarn, setCliWarn] = useState<"claude" | "codex" | null>(null);
  const add = (pick: string) => ai.set((x) => {
    const pr = PROVIDER_PRESETS.find((q) => q.id === pick), base = pr?.id ?? "custom";
    let id = base;
    for (let n = 2; x.providers.some((q) => q.id === id); n++) id = `${base}-${n}`;
    const p: ProviderConfig = { id, kind: pr?.kind ?? "openai_compat", label: pr?.label ?? "Custom (OpenAI-compatible)", base_url: pr?.base_url ?? "http://localhost:8080/v1", ...(pr?.auth_header && { auth_header: pr.auth_header }), ...(!pr?.keyless && { secret_name: `reacttutor-${id}` }), enabled: true };
    return { ...x, providers: [...x.providers, p] };
  });
  const addCli = (cli: "claude" | "codex") => ai.set((x) => ({ ...x, providers: [...x.providers.filter((p) => p.cli !== cli), { id: `cli-${cli}`, kind: "cli_bridge", cli, label: cli === "claude" ? "Claude Code CLI" : "Codex CLI", enabled: true }], models: { ...x.models, [`cli-${cli}`]: cli === "claude" ? ["default", "opus", "sonnet", "haiku"] : ["default"] } }));
  return <div className="space-y-4">
    <p className="text-sm text-muted">Kit, your tutor, needs an AI model. Pick any provider below, load its models, and click the model you want to study with. You can switch models any time from the tutor panel.</p>
    {s.selected && <div className="text-sm">Studying with: <Badge tone="accent" className="font-mono">{s.providers.find((p) => p.id === s.selected!.provider_id)?.label} · {s.selected.model}</Badge></div>}
    <ChatGptLogin />
    {s.providers.filter((p) => p.kind !== "oauth").map((p) => <ProviderCard key={p.id} p={p} />)}
    {s.providers.filter((p) => p.kind === "oauth").map((p) => <ProviderCard key={p.id} p={p} />)}
    <div className="flex flex-wrap gap-2">
      <Select aria-label="Add provider" className="w-80" value="" onChange={(e) => e.target.value && add(e.target.value)}>
        <option value="">+ Add an AI provider…</option><option value="custom">Custom OpenAI-compatible (any URL)</option>
        {[...new Set(PROVIDER_PRESETS.map((q) => q.group))].map((g) => <optgroup key={g} label={g}>
          {PROVIDER_PRESETS.filter((q) => q.group === g).map((q) => <option key={q.id} value={q.id}>{q.label}</option>)}</optgroup>)}
      </Select>
      <Button onClick={() => setCliWarn("claude")}><Plus size={14} />Claude Code CLI</Button>
      <Button onClick={() => setCliWarn("codex")}><Plus size={14} />Codex CLI</Button>
    </div>
    <Confirm open={!!cliWarn} title="Use a command-line AI you're signed in to?" confirmLabel="Add it" onClose={() => setCliWarn(null)} onConfirm={() => cliWarn && addCli(cliWarn)}>
      <p>This runs the official <code>{cliWarn}</code> program already installed and signed in on this computer. React Tutor never reads its sign-in. It is slower than an API and is an experimental option.</p>
    </Confirm>
  </div>;
}

function VoiceSection() {
  const n = narration.use(), p = prefs.use();
  const rec = recommend(n.hw ?? null);
  const gb = (b: number) => `${Math.round(b / 2 ** 30)} GB`;
  const setEngine = (engine: Prefs["engine"]) => { prefs.set((x) => ({ ...x, engine })); initNarration(); };
  const test = () => {
    const line = "Hi! I'm your narrator. Let's learn React together, one small step at a time.";
    const c = synth(line);
    if (c) c.then((x) => playClip(x.url)).catch(() => {});
    else browserSpeak(line, p.rate);
  };
  return <div className="space-y-4">
    <p className="text-sm text-muted">Lessons are narrated with <b>Kitten TTS</b>, running privately on your computer. The same engine also powers the microphone (speech to text with Whisper), so you can talk to Kit instead of typing.</p>
    <Card className="space-y-1 p-3 text-sm">
      <div className="flex items-center gap-2 font-medium"><Cpu size={14} />Your computer</div>
      {n.hw ? <div className="text-muted">{n.hw.gpus.map((g) => `${g.name} (${gb(g.vram_bytes)})`).join(", ") || "No graphics card found"} · {gb(n.hw.ram_bytes)} memory · {n.hw.cpus} CPU threads</div> : <div className="text-muted">Checking…</div>}
      <div>Recommended: <b>{rec.label}</b></div>
    </Card>
    <Field label="Narration engine">
      <Select value={p.engine} onChange={(e) => setEngine(e.target.value as Prefs["engine"])}>
        <option value="auto">Automatic: {rec.label}</option>
        {Object.values(ENGINES).map((e) => <option key={e.id} value={e.id}>{e.label}</option>)}
        <option value="browser">System voice (no download, less natural; no microphone transcription)</option>
        <option value="off">No narration (captions only)</option>
      </Select>
    </Field>
    <Card className="space-y-2 p-3 text-sm">
      <div className="flex items-center gap-2">Status: <Badge tone={n.status === "ready" ? "success" : n.status === "error" ? "danger" : "muted"}>{n.status === "ready" ? `ready on ${n.device}` : n.status}</Badge>
        {(n.status === "checking" || n.status === "starting" || n.status === "installing") && <Loader2 size={14} className="animate-spin" />}</div>
      {n.status === "needs-setup" && n.engine && <><div className="text-muted">One-time setup: {n.engine.label}, {n.engine.size}. It installs a private Python environment with <code>uv</code>. It may take several minutes.</div>
        <div className={n.uv ? "text-muted" : "text-warning"}>{n.uv ? <>Uses the uv already on this PC: <code className="break-all">{n.uv}</code></> : <>uv (the tool that sets up Python for the voice engine) isn't installed on this PC. Setup will install it for you first, from uv's official installer.</>}</div>
        <Button variant="primary" onClick={setupNarration}>Set up natural narration</Button></>}
      {n.status === "starting" && <div className="text-muted">Starting the voice engine. The first start downloads the voice model, so it can take a few minutes.</div>}
      {n.error && <pre className="max-h-40 overflow-auto whitespace-pre-wrap text-xs text-danger">{n.error}</pre>}
      {(n.status === "error" || n.status === "starting") && <Button size="sm" onClick={initNarration}><RefreshCw size={12} />Try again</Button>}
      {n.log.length > 0 && <pre className="max-h-48 overflow-auto rounded bg-surface-2 p-2 text-[11px] text-muted">{n.log.slice(-60).join("\n")}</pre>}
    </Card>
    <Field label={`Volume: ${Math.round(p.volume * 100)}%`}><input type="range" min={0} max={1} step={0.05} value={p.volume} onChange={(e) => prefs.set((x) => ({ ...x, volume: Number(e.target.value) }))} className="w-full accent-[var(--accent)]" /></Field>
    {n.voices.length > 0 && <Field label="Voice"><Select value={p.voice} onChange={(e) => prefs.set((x) => ({ ...x, voice: e.target.value }))}>{n.voices.map((v) => <option key={v}>{v}</option>)}</Select></Field>}
    <Button onClick={test}><Volume2 size={14} />Test the voice</Button>
  </div>;
}

export default function Settings({ back }: { back?: () => void }) {
  const [sec, setSec] = useState<Sec>("ai");
  const p = prefs.use();
  const [reset, setReset] = useState(false);
  return <div className="flex h-full min-h-0 flex-col">
    <div className="flex items-center gap-2 border-b border-border pr-2">
      <div className="min-w-0 flex-1"><Tabs tabs={SECTIONS.map((s) => ({ id: s.id, label: s.label }))} value={sec} onChange={setSec} /></div>
      {back && <Button size="sm" variant="primary" onClick={back}><ArrowLeft size={12} />Back to your lesson</Button>}
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto p-6"><div className="mx-auto max-w-3xl">
      {sec === "ai" && <AiSection />}
      {sec === "voice" && <VoiceSection />}
      {sec === "look" && <div className="space-y-4">
        <Field label="Theme"><Select value={p.theme} onChange={(e) => prefs.set((x) => ({ ...x, theme: e.target.value as Prefs["theme"] }))}><option value="dark">Dark</option><option value="light">Light</option></Select></Field>
        <Field label={`Code font size: ${p.fontSize}px`}><input type="range" min={11} max={22} value={p.fontSize} onChange={(e) => prefs.set((x) => ({ ...x, fontSize: Number(e.target.value) }))} className="w-full" /></Field>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={p.speakReplies} onChange={(e) => prefs.set((x) => ({ ...x, speakReplies: e.target.checked }))} />Read Kit's answers aloud</label>
      </div>}
      {sec === "progress" && <div className="space-y-3 text-sm">
        <p className="text-muted">Your progress, your code and your custom lessons are saved on this computer.</p>
        <Button variant="danger" onClick={() => setReset(true)}>Reset all progress</Button>
        <Confirm open={reset} danger title="Reset all progress?" confirmLabel="Reset" onClose={() => setReset(false)} onConfirm={() => progress.set(() => ({ done: {}, code: {}, review: {}, notes: {}, pos: {}, custom: [] }))}>
          <p>This clears finished lessons, your saved code, review questions and custom lessons. It can't be undone.</p>
        </Confirm>
      </div>}
    </div></div>
  </div>;
}
