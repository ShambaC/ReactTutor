// LLM layer contracts (ported from Scout's packages/agent/src/types.ts).
export type ProviderKind = "openai_compat" | "anthropic" | "llama_local" | "cli_bridge" | "oauth";
export interface ProviderConfig {
  id: string;
  kind: ProviderKind;
  label: string;
  /** openai_compat: Chat Completions root, e.g. https://api.openai.com/v1; anthropic: host root (/v1/messages is appended). */
  base_url?: string;
  /** Header carrying the key when not the default. Names ending in `authorization` get a `Bearer ` prefix. */
  auth_header?: string;
  /** Keychain entry name holding the API key (never the key itself). */
  secret_name?: string;
  cli?: "claude" | "codex";
  oauth?: import("./rust").OAuthProviderId;
  /** USD per 1M tokens, keyed by model id. */
  prices?: Record<string, { in: number; out: number }>;
  enabled: boolean;
}

export interface ChatMessage { role: "system" | "user" | "assistant"; content: string }
export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens: number;
  json_schema?: object;
}
export interface ChatResponse { text: string; tokens_in: number; tokens_out: number }
export interface LlmProvider {
  id: string;
  kind: ProviderKind;
  capabilities: { streaming: boolean; tools: boolean; json_mode: boolean; max_context: number; embeddings: boolean };
  chat(req: ChatRequest): Promise<ChatResponse>;
  chatStream?(req: ChatRequest, onDelta: (text: string) => void): Promise<ChatResponse>;
  embed?(model: string, texts: string[]): Promise<{ vectors: number[][]; tokens: number }>;
  estimateCost(model: string, tokens_in: number, tokens_out: number): number;
}
