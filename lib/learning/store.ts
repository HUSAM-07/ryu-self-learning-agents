import type {
  SignalRecord,
  SignalFeedback,
  LearnedRule,
  LearningState,
  TradingSignal,
  AIAnalysis,
} from "@/lib/types";

const STORAGE_KEY = "ryujin-learning";

function defaultState(): LearningState {
  return { signals: [], rules: [], promptVersion: 1 };
}

export function loadLearningState(): LearningState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw) as LearningState;
  } catch {
    return defaultState();
  }
}

export function saveLearningState(state: LearningState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Generate a simple unique ID */
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Record a new signal after AI analysis */
export function recordSignal(
  signal: TradingSignal,
  analysis: AIAnalysis,
  entryPrice: number,
  symbol: string,
  interval: string
): SignalRecord {
  const state = loadLearningState();
  const record: SignalRecord = {
    id: uid(),
    timestamp: Date.now(),
    symbol,
    interval,
    direction: signal.direction,
    confidence: signal.confidence,
    composite: signal.composite,
    entryPrice,
    marketBias: analysis.marketBias,
    summary: analysis.summary,
  };
  state.signals.push(record);
  saveLearningState(state);
  return record;
}

/** Add user feedback to a signal */
export function addFeedback(signalId: string, feedback: SignalFeedback) {
  const state = loadLearningState();
  const sig = state.signals.find((s) => s.id === signalId);
  if (sig) {
    sig.feedback = feedback;
    saveLearningState(state);
  }
}

/** Update outcome price for open signals */
export function updateOutcomes(currentPrice: number, symbol: string) {
  const state = loadLearningState();
  let changed = false;
  for (const sig of state.signals) {
    if (sig.symbol !== symbol || sig.outcomePrice !== undefined) continue;
    // Only resolve signals older than 1 hour
    if (Date.now() - sig.timestamp < 60 * 60 * 1000) continue;

    sig.outcomePrice = currentPrice;
    sig.outcomeTimestamp = Date.now();
    if (sig.direction === "BUY") {
      sig.pnlPercent = ((currentPrice - sig.entryPrice) / sig.entryPrice) * 100;
    } else if (sig.direction === "SELL") {
      sig.pnlPercent = ((sig.entryPrice - currentPrice) / sig.entryPrice) * 100;
    } else {
      sig.pnlPercent = 0;
    }
    changed = true;
  }
  if (changed) saveLearningState(state);
}

/** Save evolved rules from LLM self-reflection */
export function saveEvolvedRules(rules: string[], source: "self-reflection" | "user-feedback") {
  const state = loadLearningState();
  state.promptVersion += 1;
  const newRules: LearnedRule[] = rules.map((rule) => ({
    id: uid(),
    rule,
    source,
    createdAt: Date.now(),
    version: state.promptVersion,
  }));
  state.rules = [...state.rules, ...newRules];
  saveLearningState(state);
  return state;
}

/** Get current active rules (latest version's rules + any from prior versions still relevant) */
export function getActiveRules(): LearnedRule[] {
  const state = loadLearningState();
  return state.rules;
}

/** Compute learning stats */
export function getLearningStats() {
  const state = loadLearningState();
  const total = state.signals.length;
  const withFeedback = state.signals.filter((s) => s.feedback);
  const accurate = withFeedback.filter((s) => s.feedback?.rating === "accurate").length;
  const accuracy = withFeedback.length > 0 ? (accurate / withFeedback.length) * 100 : 0;

  const withOutcome = state.signals.filter((s) => s.pnlPercent !== undefined);
  const totalPnl = withOutcome.reduce((sum, s) => sum + (s.pnlPercent ?? 0), 0);
  const profitable = withOutcome.filter((s) => (s.pnlPercent ?? 0) > 0).length;
  const winRate = withOutcome.length > 0 ? (profitable / withOutcome.length) * 100 : 0;

  return {
    totalSignals: total,
    feedbackCount: withFeedback.length,
    accuracy,
    promptVersion: state.promptVersion,
    rulesCount: state.rules.length,
    totalPnl,
    winRate,
    withOutcomeCount: withOutcome.length,
  };
}

/** Clear all learning data */
export function resetLearningState() {
  saveLearningState(defaultState());
}
