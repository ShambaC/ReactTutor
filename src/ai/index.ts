import { persisted } from "../store";
import { anthropicProvider } from "./providers/anthropic";
import { cliProvider } from "./providers/cli";
import { codexModels } from "./providers/oauth";
import { HttpError, authHeaders, openaiProvider } from "./providers/openai";
import { oauthProvider } from "./providers/oauth";
import { http } from "./rust";
import type { ChatMessage, LlmProvider, ProviderConfig } from "./types";

export interface AiSettings {
  providers: ProviderConfig[];
  /** The model the student picked to study with. */
  selected: { provider_id: string; model: string } | null;
  /** Cached model lists per provider id. */
  models: Record<string, string[]>;
}
export const ai = persisted<AiSettings>("rt.ai", { providers: [], selected: null, models: {} });

export function getProvider(cfg: ProviderConfig): LlmProvider {
  switch (cfg.kind) {
    case "anthropic": return anthropicProvider(cfg);
    case "oauth": return oauthProvider(cfg);
    case "cli_bridge": return cliProvider(cfg, true); // only added after the student accepts the warning
    default: return openaiProvider(cfg);
  }
}

const CLI_MODELS: Record<string, string[]> = { claude: ["default", "opus", "sonnet", "haiku"], codex: ["default"] };

/** Asks the provider which models it offers (sorted), so the student can pick one. */
export async function listModels(cfg: ProviderConfig): Promise<string[]> {
  if (cfg.kind === "cli_bridge") return CLI_MODELS[cfg.cli ?? "claude"];
  if (cfg.kind === "oauth") return (await codexModels()).map((m) => m.slug);
  const base = (cfg.base_url ?? "").replace(/\/$/, "");
  const anth = cfg.kind === "anthropic";
  const url = anth ? `${base || "https://api.anthropic.com"}/v1/models?limit=1000` : `${base}/models`;
  const headers = anth ? { ...authHeaders(cfg, "x-api-key"), "anthropic-version": "2023-06-01" } : authHeaders(cfg, "authorization");
  const r = await http({ method: "GET", url, headers, timeout_ms: 30_000 });
  if (r.status >= 400) throw new HttpError(r.status, `HTTP ${r.status} from ${new URL(url).host}: ${r.body.slice(0, 300)}`);
  const j = JSON.parse(r.body);
  const ids: string[] = (j.data ?? j.models ?? []).map((m: any) => m.id ?? m.name).filter(Boolean);
  // chat models first; embeddings/audio/image models are useless for tutoring
  return [...new Set(ids)].filter((id) => !/embed|whisper|tts|dall-e|image|moderation|audio|transcribe|rerank/i.test(id)).sort();
}

export function selectedModel(): { provider: LlmProvider; model: string; label: string } | null {
  const s = ai.get();
  const cfg = s.selected && s.providers.find((p) => p.id === s.selected!.provider_id && p.enabled);
  if (!cfg || !s.selected) return null;
  return { provider: getProvider(cfg), model: s.selected.model, label: `${cfg.label} · ${s.selected.model}` };
}

/** Reasoning models (Gemma, Qwen, DeepSeek...) may prefix answers with <think>...</think>; never show or parse that part. */
export const stripThink = (t: string) => t.replace(/<think>[\s\S]*?(<\/think>|$)/g, "").replace(/^[\s\S]*?<\/think>/, "").trimStart();

/** Streams when the provider can; resolves with the full text (thinking removed). `json`: ask for JSON output (JSON mode where the provider has one). */
/** `onText` gets the whole reply so far (think blocks removed), not just the new piece. */
export async function chat(messages: ChatMessage[], onText: (t: string) => void, max_tokens = 1500, json?: object): Promise<string> {
  const sel = selectedModel();
  if (!sel) throw new Error("No AI model chosen yet. Pick one in Settings → AI tutor.");
  const req = { model: sel.model === "default" ? "" : sel.model, messages, max_tokens, ...(json && { json_schema: json }) };
  let raw = "";
  if (sel.provider.chatStream && !(json && sel.provider.capabilities.json_mode)) {
    raw = (await sel.provider.chatStream(req, (d) => { raw += d; onText(stripThink(raw)); })).text;
  } else {
    raw = (await sel.provider.chat(req)).text;
    onText(stripThink(raw));
  }
  return stripThink(raw);
}
