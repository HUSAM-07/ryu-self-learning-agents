/**
 * AWS Bedrock client for Claude Opus 4.6
 * Uses temporary STS bearer token auth (hackathon-friendly).
 *
 * The bearer token is a pre-signed URL encoded as base64.
 * It expires after ~12 hours — rotate via `BEDROCK_BEARER_TOKEN` in .env.local.
 */

const BEDROCK_ENDPOINT = process.env.BEDROCK_ENDPOINT!;
const BEDROCK_BEARER_TOKEN = process.env.BEDROCK_BEARER_TOKEN!;

export interface BedrockMessage {
  role: "user" | "assistant";
  content: string;
}

export interface BedrockRequest {
  messages: BedrockMessage[];
  max_tokens?: number;
  system?: string;
  temperature?: number;
}

export interface BedrockResponse {
  id: string;
  type: string;
  role: string;
  model: string;
  content: { type: string; text: string }[];
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
}

/**
 * Call Claude Opus 4.6 via AWS Bedrock InvokeModel.
 *
 * @example
 * const res = await invokeBedrock({
 *   system: "You are a trading signal analyst.",
 *   messages: [{ role: "user", content: "Analyze this RSI divergence..." }],
 *   max_tokens: 1024,
 * });
 * console.log(res.content[0].text);
 */
export async function invokeBedrock(req: BedrockRequest): Promise<BedrockResponse> {
  if (!BEDROCK_ENDPOINT || !BEDROCK_BEARER_TOKEN) {
    throw new Error(
      "Missing BEDROCK_ENDPOINT or BEDROCK_BEARER_TOKEN in env. " +
      "Copy .env.local.example → .env.local and fill in your token."
    );
  }

  const body = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: req.max_tokens ?? 2048,
    ...(req.system && { system: req.system }),
    ...(req.temperature != null && { temperature: req.temperature }),
    messages: req.messages,
  };

  const res = await fetch(BEDROCK_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BEDROCK_BEARER_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Bedrock ${res.status}: ${text}`);
  }

  return res.json() as Promise<BedrockResponse>;
}

/**
 * Convenience: send a single user message and get back the text response.
 */
export async function askBedrock(
  prompt: string,
  opts?: { system?: string; max_tokens?: number; temperature?: number }
): Promise<string> {
  const res = await invokeBedrock({
    messages: [{ role: "user", content: prompt }],
    ...opts,
  });
  return res.content[0]?.text ?? "";
}

/**
 * Ask Bedrock for a JSON response.
 * Wraps the system prompt to enforce JSON output.
 */
export async function askBedrockJSON<T = unknown>(
  prompt: string,
  opts?: { system?: string; max_tokens?: number; temperature?: number }
): Promise<T> {
  const systemPrefix = "You must respond with valid JSON only. No markdown, no explanation.\n\n";
  const res = await invokeBedrock({
    messages: [{ role: "user", content: prompt }],
    system: systemPrefix + (opts?.system ?? ""),
    max_tokens: opts?.max_tokens,
    temperature: opts?.temperature,
  });

  const text = res.content[0]?.text ?? "{}";
  return JSON.parse(text) as T;
}
