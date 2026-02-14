/**
 * AWS Bedrock client for Claude Opus 4.6
 * Uses AWS SDK with SigV4 signing (standard IAM/STS credentials).
 *
 * Credentials come from env vars: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 * AWS_SESSION_TOKEN (optional). These are temporary STS creds — rotate as needed.
 */

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

function getModelId() { return process.env.BEDROCK_MODEL_ID ?? "global.anthropic.claude-opus-4-6-v1"; }
function getRegion() { return process.env.BEDROCK_REGION ?? "us-west-2"; }

/** Lazily create the client so env vars are read at call time */
let _client: BedrockRuntimeClient | null = null;
function getClient(): BedrockRuntimeClient {
  // Recreate if region changed (unlikely, but safe)
  if (!_client) {
    _client = new BedrockRuntimeClient({ region: getRegion() });
  }
  return _client;
}

/** Force client re-creation (e.g. after rotating credentials) */
export function resetClient() {
  _client = null;
}

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
 * Uses the AWS SDK which handles SigV4 signing automatically from
 * standard AWS env vars (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 * AWS_SESSION_TOKEN).
 */
export async function invokeBedrock(req: BedrockRequest): Promise<BedrockResponse> {
  const client = getClient();

  const body = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: req.max_tokens ?? 2048,
    ...(req.system && { system: req.system }),
    ...(req.temperature != null && { temperature: req.temperature }),
    messages: req.messages,
  };

  const command = new InvokeModelCommand({
    modelId: getModelId(),
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(body),
  });

  const response = await client.send(command);

  const text = new TextDecoder().decode(response.body);
  return JSON.parse(text) as BedrockResponse;
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
