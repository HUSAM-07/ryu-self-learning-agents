import { NextResponse } from "next/server";
import { askLLMJSON } from "@/lib/openrouter";
import type { SignalRecord } from "@/lib/types";

interface EvolveRequestBody {
  signals: SignalRecord[];
  currentRules: string[];
}

interface EvolveResponse {
  rules: string[];
  reasoning: string;
}

export async function POST(request: Request) {
  try {
    const body: EvolveRequestBody = await request.json();
    const { signals, currentRules } = body;

    if (!signals?.length) {
      return NextResponse.json(
        { error: "Need at least 1 signal with feedback to evolve" },
        { status: 400 }
      );
    }

    const signalSummary = signals
      .slice(-20) // last 20 signals
      .map((s) => {
        const fb = s.feedback
          ? `User: ${s.feedback.rating}${s.feedback.note ? ` — "${s.feedback.note}"` : ""}`
          : "No feedback";
        const pnl = s.pnlPercent !== undefined ? `P&L: ${s.pnlPercent.toFixed(2)}%` : "P&L: pending";
        return `[${new Date(s.timestamp).toISOString().slice(0, 16)}] ${s.symbol} ${s.interval} → ${s.direction} (${s.confidence.toFixed(0)}% conf, score ${s.composite.toFixed(1)}) | Entry: $${s.entryPrice.toFixed(0)} | ${pnl} | ${fb}`;
      })
      .join("\n");

    const currentRulesText = currentRules.length > 0
      ? `Current learned rules:\n${currentRules.map((r, i) => `${i + 1}. ${r}`).join("\n")}`
      : "No learned rules yet (first evolution).";

    const withFeedback = signals.filter((s) => s.feedback);
    const accurate = withFeedback.filter((s) => s.feedback?.rating === "accurate").length;
    const accuracy = withFeedback.length > 0 ? ((accurate / withFeedback.length) * 100).toFixed(0) : "N/A";

    const prompt = `You are Ryujin's self-improvement module. Your job is to analyze past trading signal performance and evolve the analysis rules.

## Performance Data
Total signals: ${signals.length}
Signals with feedback: ${withFeedback.length}
User-rated accuracy: ${accuracy}%

## Recent Signal History
${signalSummary}

## ${currentRulesText}

## Your Task
Based on the performance data, user feedback, and outcomes:
1. Identify patterns in what worked and what didn't
2. Generate 3-5 concise, actionable rules that should improve future signal analysis
3. Rules should be specific (e.g., "When RSI is between 40-60, weigh MACD histogram direction more heavily")
4. If current rules exist, keep ones that seem effective, modify or replace ineffective ones
5. Explain your reasoning briefly

Respond with JSON:
{
  "rules": ["rule 1", "rule 2", "rule 3"],
  "reasoning": "1-2 sentence explanation of what you learned from the data"
}`;

    const result = await askLLMJSON<EvolveResponse>(prompt, {
      system:
        "You are Ryujin's self-learning module. Analyze trading signal performance and generate improved rules. Respond with valid JSON only.",
      max_tokens: 1024,
      temperature: 0.4,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Evolution failed";
    console.error("[/api/evolve] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
