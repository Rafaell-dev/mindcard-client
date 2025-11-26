"use client";

import * as React from "react";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";

export function QuestionCardOpen({
  question,
  value,
  onChange,
  revealed,
}: {
  question: string;
  value?: string;
  onChange?: (value: string) => void;
  revealed?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between space-y-6 min-h-[55vh]">
      <div className={"flex flex-1 items-center justify-center rounded-2xl p-6 text-center input-border transition-colors " + (revealed ? "bg-green-100" : "bg-background") }>
        <p className="text-lg font-bold">{question}</p>
      </div>
      <div>
        <Label htmlFor="answer" className="sr-only">
          Responder
        </Label>
        <Input
          id="answer"
          placeholder="Responder"
          className={"h-12 rounded-full input-border bg-background px-5 transition-colors " + (revealed ? "bg-green-50" : "bg-background")}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        {revealed && (
          <p className="mt-3 text-sm font-medium text-green-700">Resposta: {value?.trim() || "(vazia)"}</p>
        )}
      </div>
    </div>
  );
}
