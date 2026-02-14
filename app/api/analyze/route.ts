import { NextResponse } from "next/server";
import type { AIAnalysis, Candle, IndicatorData, TradingSignal } from "@/lib/types";
import { askBedrockJSON } from "@/lib/bedrock";
import { buildAnalysisPrompt } from "@/prompts/analyze-signal";

interface AnalyzeRequestBody {
  candles: Candle[];
  indicators: IndicatorData;
  signal: TradingSignal;
}

export async function POST(request: Request) {
  try {
    const body: AnalyzeRequestBody = await request.json();
    const { candles, indicators, signal } = body;

    if (!candles?.length || !indicators || !signal) {
      return NextResponse.json(
        { error: "Missing required fields: candles, indicators, signal" },
        { status: 400 }
      );
    }

    const prompt = buildAnalysisPrompt(candles, indicators, signal);

    const analysis = await askBedrockJSON<AIAnalysis>(prompt, {
      system:
        "You are Ryujin, an expert Bitcoin trading signal analyst. " +
        "Respond with valid JSON only. Be precise, reference actual values, " +
        "and explain in layman's terms.",
      max_tokens: 2048,
      temperature: 0.3,
    });

    return NextResponse.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";

    console.error("[/api/analyze] Error:", message);

    // Detect AWS credential / access errors
    const isAuthError =
      message.includes("ExpiredTokenException") ||
      message.includes("UnrecognizedClientException") ||
      message.includes("AccessDeniedException") ||
      message.includes("credentials");
    if (isAuthError) {
      return NextResponse.json(
        {
          error: "AWS credentials expired or invalid. Rotate AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_SESSION_TOKEN in .env.local.",
          detail: message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
