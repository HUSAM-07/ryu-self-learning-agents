"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DragonLogo } from "@/components/landing/dragon-logo";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import Link from "next/link";
import type { LearningState, SignalRecord, LearnedRule } from "@/lib/types";
import {
  loadLearningState,
  getLearningStats,
  saveEvolvedRules,
  resetLearningState,
} from "@/lib/learning/store";

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("h-4 w-4", color)} />
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn("text-2xl font-bold font-mono", color)}>{value}</p>
      {sub && <p className="text-[10px] font-mono text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function SignalJournalEntry({ record }: { record: SignalRecord }) {
  const dirColor =
    record.direction === "BUY"
      ? "text-green-400"
      : record.direction === "SELL"
      ? "text-red-400"
      : "text-yellow-400";

  const pnlColor =
    record.pnlPercent !== undefined
      ? record.pnlPercent > 0
        ? "text-green-400"
        : record.pnlPercent < 0
        ? "text-red-400"
        : "text-muted-foreground"
      : "text-muted-foreground";

  return (
    <div className="border border-border rounded-lg p-3 bg-card hover:bg-muted/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold font-mono", dirColor)}>{record.direction}</span>
          <Badge variant="outline" className="text-[9px] font-mono py-0">
            {record.symbol}
          </Badge>
          <Badge variant="outline" className="text-[9px] font-mono py-0">
            {record.interval}
          </Badge>
        </div>
        <span className="text-[9px] font-mono text-muted-foreground">
          {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <span className="text-muted-foreground">
            Entry: <span className="text-foreground/80">${record.entryPrice.toFixed(2)}</span>
          </span>
          <span className="text-muted-foreground">
            Conf: <span className="text-foreground/80">{record.confidence.toFixed(0)}%</span>
          </span>
          {record.pnlPercent !== undefined && (
            <span className="text-muted-foreground">
              P&L: <span className={pnlColor}>{record.pnlPercent > 0 ? "+" : ""}{record.pnlPercent.toFixed(2)}%</span>
            </span>
          )}
        </div>
      </div>

      <p className="text-[10px] font-mono text-muted-foreground leading-relaxed line-clamp-2">
        {record.summary}
      </p>

      {record.feedback && (
        <div className="mt-2 flex items-center gap-2">
          {record.feedback.rating === "accurate" ? (
            <ThumbsUp className="h-3 w-3 text-green-400" />
          ) : (
            <ThumbsDown className="h-3 w-3 text-red-400" />
          )}
          <span className="text-[9px] font-mono text-muted-foreground">
            {record.feedback.rating}
            {record.feedback.note && ` — "${record.feedback.note}"`}
          </span>
        </div>
      )}
    </div>
  );
}

function RuleCard({ rule, index }: { rule: LearnedRule; index: number }) {
  return (
    <div className="border border-border rounded-lg p-3 bg-card">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-medium text-green-400">Rule {index + 1}</span>
          <Badge variant="outline" className="text-[8px] font-mono py-0 px-1">
            v{rule.version}
          </Badge>
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-[8px] font-mono py-0 px-1.5",
            rule.source === "self-reflection"
              ? "text-purple-400 border-purple-500/30"
              : "text-blue-400 border-blue-500/30"
          )}
        >
          {rule.source === "self-reflection" ? "AI Learned" : "User Guided"}
        </Badge>
      </div>
      <p className="text-[11px] font-mono text-foreground/70 leading-relaxed">{rule.rule}</p>
      <p className="text-[9px] font-mono text-muted-foreground/50 mt-1">
        {new Date(rule.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}

export function LearningDashboard() {
  const [state, setState] = useState<LearningState | null>(null);
  const [evolving, setEvolving] = useState(false);
  const [evolveResult, setEvolveResult] = useState<string | null>(null);

  useEffect(() => {
    setState(loadLearningState());
  }, []);

  const stats = state ? getLearningStats() : null;

  const evolvePrompt = useCallback(async () => {
    if (!state || state.signals.length === 0) return;

    setEvolving(true);
    setEvolveResult(null);

    try {
      const res = await fetch("/api/evolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signals: state.signals,
          currentRules: state.rules.map((r) => r.rule),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const newState = saveEvolvedRules(data.rules, "self-reflection");
      setState(newState);
      setEvolveResult(data.reasoning);
    } catch (err) {
      setEvolveResult(`Error: ${err instanceof Error ? err.message : "Evolution failed"}`);
    } finally {
      setEvolving(false);
    }
  }, [state]);

  const handleReset = useCallback(() => {
    resetLearningState();
    setState(loadLearningState());
    setEvolveResult(null);
  }, []);

  if (!state) return null;

  const signals = [...state.signals].reverse();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-[1200px] flex items-center justify-between px-4 h-12">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <DragonLogo size={24} />
              <span className="font-bold text-sm tracking-tight font-mono">Ryujin</span>
            </Link>
            <span className="text-[10px] font-mono text-green-400/60">Adaptive Intelligence</span>
          </div>
          <AnimatedThemeToggler className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer" />
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] p-6 space-y-6">
        {/* Hero */}
        <div className="text-center space-y-2 py-4">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-8 w-8 text-green-400" />
            <h1 className="text-3xl font-bold font-mono">Adaptive Intelligence</h1>
          </div>
          <p className="text-sm font-mono text-muted-foreground max-w-xl mx-auto">
            Ryujin learns from every signal. User feedback and self-reflection evolve the AI&apos;s analysis rules in real-time.
          </p>
        </div>

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={Target}
              label="Signals"
              value={stats.totalSignals.toString()}
              sub={`${stats.feedbackCount} with feedback`}
              color="text-foreground"
            />
            <StatCard
              icon={TrendingUp}
              label="Accuracy"
              value={stats.feedbackCount > 0 ? `${stats.accuracy.toFixed(0)}%` : "—"}
              sub={stats.feedbackCount > 0 ? `${stats.feedbackCount} rated` : "No feedback yet"}
              color="text-green-400"
            />
            <StatCard
              icon={Zap}
              label="Prompt v"
              value={`v${stats.promptVersion}`}
              sub={`${stats.rulesCount} learned rules`}
              color="text-purple-400"
            />
            <StatCard
              icon={TrendingUp}
              label="Win Rate"
              value={stats.withOutcomeCount > 0 ? `${stats.winRate.toFixed(0)}%` : "—"}
              sub={stats.withOutcomeCount > 0 ? `${stats.totalPnl.toFixed(2)}% total P&L` : "No outcomes yet"}
              color={stats.totalPnl >= 0 ? "text-green-400" : "text-red-400"}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Signal Journal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-foreground/60" />
                <h2 className="text-sm font-bold font-mono text-foreground/80">Signal Journal</h2>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {signals.length} entries
              </span>
            </div>

            {signals.length === 0 ? (
              <div className="border border-border rounded-lg p-8 bg-card text-center">
                <Target className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-[11px] font-mono text-muted-foreground/50">
                  No signals yet. Run an AI Analysis on the dashboard to start learning.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block mt-3 text-[11px] font-mono text-green-400 hover:underline"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {signals.map((s) => (
                  <SignalJournalEntry key={s.id} record={s} />
                ))}
              </div>
            )}
          </div>

          {/* AI Brain */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400" />
              <h2 className="text-sm font-bold font-mono text-foreground/80">AI Brain</h2>
            </div>

            <div className="border border-purple-500/20 rounded-lg p-4 bg-purple-500/5 space-y-3">
              <p className="text-[10px] font-mono text-muted-foreground">
                Rules derived from self-reflection on past performance. These are injected into every future analysis prompt.
              </p>

              {state.rules.length === 0 ? (
                <div className="text-center py-4">
                  <Sparkles className="h-6 w-6 text-purple-400/30 mx-auto mb-2" />
                  <p className="text-[10px] font-mono text-muted-foreground/50">
                    No rules yet. Run analyses, provide feedback, then evolve.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {state.rules.map((rule, i) => (
                    <RuleCard key={rule.id} rule={rule} index={i} />
                  ))}
                </div>
              )}
            </div>

            {/* Evolve button */}
            <Button
              onClick={evolvePrompt}
              disabled={evolving || state.signals.length === 0}
              className="w-full bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 font-mono text-xs disabled:opacity-30"
            >
              {evolving ? (
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 border border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                  Evolving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Brain className="h-3.5 w-3.5" />
                  Evolve Brain
                </span>
              )}
            </Button>

            {state.signals.length === 0 && (
              <p className="text-[9px] font-mono text-muted-foreground/50 text-center">
                Need at least 1 signal with feedback to evolve
              </p>
            )}

            {/* Evolution result */}
            {evolveResult && (
              <div className={cn(
                "border rounded-lg p-3",
                evolveResult.startsWith("Error")
                  ? "border-red-500/30 bg-red-500/5"
                  : "border-green-500/30 bg-green-500/5"
              )}>
                <p className="text-[10px] font-mono text-muted-foreground leading-relaxed">
                  <span className="text-foreground/80 font-medium">Reasoning: </span>
                  {evolveResult}
                </p>
              </div>
            )}

            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground/40 hover:text-red-400 transition-colors mx-auto cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset all learning data
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
