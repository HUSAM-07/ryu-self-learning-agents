/**
 * OpenRouter LLM client for Ryujin.
 * Uses @openrouter/sdk to call x-ai/grok-4.1-fast (or any model).
 *
 * Credentials: OPENROUTER_API_KEY in .env.local
 */

import { OpenRouter } from "@openrouter/sdk";

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set in .env.local");
  return key;
}

function getModel(): string {
  return process.env.OPENROUTER_MODEL ?? "x-ai/grok-4.1-fast";
}

/** Lazily create the client so env vars are read at call time */
let _client: OpenRouter | null = null;
function getClient(): OpenRouter {
  if (!_client) {
    _client = new OpenRouter({ apiKey: getApiKey() });
  }
  return _client;
}

/** Force client re-creation (e.g. after rotating API key) */
export function resetClient() {
  _client = null;
}

export interface LLMMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface LLMRequestOpts {
  system?: string;
  max_tokens?: number;
  temperature?: number;
}

/**
 * Send a chat completion request to OpenRouter (non-streaming).
 * Returns the raw text response.
 */
export async function askLLM(
  prompt: string,
  opts?: LLMRequestOpts
): Promise<string> {
  const client = getClient();
  const messages: LLMMessage[] = [];

  if (opts?.system) {
    messages.push({ role: "system", content: opts.system });
  }
  messages.push({ role: "user", content: prompt });

  const response = await client.chat.send({
    chatGenerationParams: {
      model: getModel(),
      messages,
      stream: false,
      ...(opts?.max_tokens != null && { maxTokens: opts.max_tokens }),
      ...(opts?.temperature != null && { temperature: opts.temperature }),
    },
  });

  const text = response.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from OpenRouter");
  return typeof text === "string" ? text : JSON.stringify(text);
}

/**
 * Ask OpenRouter for a JSON response.
 * Wraps the system prompt to enforce JSON output.
 */
export async function askLLMJSON<T = unknown>(
  prompt: string,
  opts?: LLMRequestOpts
): Promise<T> {
  const systemPrefix =
    "You must respond with valid JSON only. No markdown, no explanation, no code fences.\n\n";

  const text = await askLLM(prompt, {
    ...opts,
    system: systemPrefix + (opts?.system ?? ""),
  });

  // Strip markdown code fences if the model wraps output in ```json ... ```
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}
