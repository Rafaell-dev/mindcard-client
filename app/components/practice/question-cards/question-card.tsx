"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { QuestionCardOpen } from "./question-card-open";
import { QuestionCardMultiple } from "./question-card-multiple";
import { QuestionCardAlternative } from "./question-card-alternative";

export type QuestionCardProps = {
  type: "open" | "multiple-choice" | "alternative";
  question: string;
  options?: string[];
  // Common controlled state hooks
  value?: string; // for open
  onChange?: (value: string) => void; // for open
  selected?: number | number[]; // for choices
  onSelect?: (index: number) => void; // for alt or single-choice
  revealed?: boolean; // show answer / success state
  className?: string;
};

export function QuestionCard({ type, question, options, value, onChange, selected, onSelect, revealed, className }: QuestionCardProps) {
  return (
    <div className={cn("h-full", className)}>
      {type === "open" && (
        <QuestionCardOpen question={question} value={value} onChange={onChange} revealed={revealed} />
      )}
      {type === "multiple-choice" && (
        <QuestionCardMultiple question={question} options={options ?? []} selected={selected} onSelect={onSelect} />
      )}
      {type === "alternative" && (
        <QuestionCardAlternative question={question} options={options ?? []} onSelect={onSelect} />
      )}
    </div>
  );
}
