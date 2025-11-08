"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";

export function QuestionCardMultiple({
  question,
  options,
  selected,
  onSelect,
}: {
  question: string;
  options: string[];
  selected?: number | number[];
  onSelect?: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-background p-6 text-center input-border">
        <p className="text-lg font-bold">{question}</p>
      </div>
      <ul className="grid gap-3">
        {options.map((opt, idx) => {
          const active = Array.isArray(selected)
            ? selected.includes(idx)
            : selected === idx;
          return (
            <li key={idx}>
              <button
                type="button"
                onClick={() => onSelect?.(idx)}
                className={
                  "w-full rounded-2xl px-4 py-3 text-left input-border " +
                  (active ? "bg-accent" : "bg-background")
                }
              >
                <Label className="text-base font-medium">{opt}</Label>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
