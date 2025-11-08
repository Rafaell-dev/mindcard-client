"use client";

import * as React from "react";

export function QuestionCardAlternative({
  question,
  options,
  onSelect,
}: {
  question: string;
  options: string[];
  onSelect?: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-background p-6 text-center input-border">
        <p className="text-lg font-bold">{question}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect?.(idx)}
            className="rounded-full bg-background px-5 py-2 text-sm font-medium input-border hover:bg-accent"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
