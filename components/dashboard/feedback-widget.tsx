"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackWidgetProps {
  onSubmit: (rating: "accurate" | "inaccurate", note: string) => void;
  submitted: boolean;
}

export function FeedbackWidget({ onSubmit, submitted }: FeedbackWidgetProps) {
  const [rating, setRating] = useState<"accurate" | "inaccurate" | null>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);

  if (submitted) {
    return (
      <div className="border border-green-500/20 bg-green-500/5 rounded-lg p-3 text-center">
        <p className="text-[11px] font-mono text-green-400">Feedback recorded — Ryujin is learning</p>
      </div>
    );
  }

  function handleRating(r: "accurate" | "inaccurate") {
    setRating(r);
    setShowNote(true);
  }

  function handleSubmit() {
    if (!rating) return;
    onSubmit(rating, note);
  }

  return (
    <div className="border border-border rounded-lg p-3 space-y-2">
      <p className="text-[10px] font-mono text-muted-foreground">Was this analysis accurate?</p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handleRating("accurate")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer border",
            rating === "accurate"
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "text-muted-foreground border-border hover:border-green-500/30 hover:text-green-400"
          )}
        >
          <ThumbsUp className="h-3 w-3" />
          Accurate
        </button>
        <button
          onClick={() => handleRating("inaccurate")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer border",
            rating === "inaccurate"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : "text-muted-foreground border-border hover:border-red-500/30 hover:text-red-400"
          )}
        >
          <ThumbsDown className="h-3 w-3" />
          Inaccurate
        </button>
      </div>

      {showNote && (
        <div className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional: What was off? (e.g., 'RSI was misleading, price broke through support')"
            className="w-full bg-muted/50 border border-border rounded-md px-3 py-2 text-[11px] font-mono text-foreground placeholder:text-muted-foreground/50 resize-none h-16 focus:outline-none focus:border-green-500/30"
          />
          <button
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-md text-[11px] font-mono hover:bg-green-500/30 transition-colors cursor-pointer"
          >
            <Send className="h-3 w-3" />
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
