import { NextResponse } from "next/server";
import type { AIAnalysis, Candle, IndicatorData, TradingSignal } from "@/lib/types";
import { askLLMJSON } from "@/lib/openrouter";
import { buildAnalysisPrompt } from "@/prompts/analyze-signal";

interface AnalyzeRequestBody {
  candles: Candle[];
  indicators: IndicatorData;
  signal: TradingSignal;
  learnedRules?: string[];
}

export async function POST(request: Request) {
  try {
    const body: AnalyzeRequestBody = await request.json();
    const { candles, indicators, signal, learnedRules } = body;

    if (!candles?.length || !indicators || !signal) {
      return NextResponse.json(
        { error: "Missing required fields: candles, indicators, signal" },
        { status: 400 }
      );
    }

    const prompt = buildAnalysisPrompt(candles, indicators, signal);

    // Build system prompt with learned rules
    let system =
      "You are Ryujin, an expert Bitcoin trading signal analyst. " +
      "Respond with valid JSON only. Be precise, reference actual values, " +
      "and explain in layman's terms.";

    if (learnedRules && learnedRules.length > 0) {
      system +=
        "\n\n## Learned Rules (from past performance analysis)\n" +
        "Apply these rules when analyzing — they were derived from self-reflection on previous signal accuracy:\n" +
        learnedRules.map((r, i) => `${i + 1}. ${r}`).join("\n");
    }

    const analysis = await askLLMJSON<AIAnalysis>(prompt, {
      system,
      max_tokens: 2048,
      temperature: 0.3,
    });

    return NextResponse.json(analysis);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analysis failed";

    console.error("[/api/analyze] Error:", message);

    const isAuthError =
      message.includes("401") ||
      message.includes("403") ||
      message.includes("Unauthorized") ||
      message.includes("invalid_api_key") ||
      message.includes("OPENROUTER_API_KEY");
    if (isAuthError) {
      return NextResponse.json(
        {
          error: "OpenRouter API key invalid or missing. Check OPENROUTER_API_KEY in .env.local.",
          detail: message,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
