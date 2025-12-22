"use client";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";
import { Clock, CheckCircle2, SkipForward, LucideIcon } from "lucide-react";

interface PracticeResultsProps {
  totalCards: number;
  correctAnswers: number;
  skippedQuestions: number;
  timeSpent: number; // em segundos
  onClose: () => void;
  onRestart: () => void;
}

export function PracticeResults({
  totalCards,
  correctAnswers,
  skippedQuestions,
  timeSpent,
  onClose,
  onRestart,
}: PracticeResultsProps) {
  const mm = String(Math.floor(timeSpent / 60)).padStart(2, "0");
  const ss = String(timeSpent % 60).padStart(2, "0");
  const answeredQuestions = totalCards - skippedQuestions;
  const percentage =
    answeredQuestions > 0
      ? Math.round((correctAnswers / answeredQuestions) * 100)
      : 0;

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Prática Concluída!</h1>
        <p className="text-lg text-muted-foreground">Confira seu desempenho</p>
      </div>

      <div className="space-y-4 w-full max-w-md">
        <ResultCard
          icon={Clock}
          label="Tempo gasto"
          value={`${mm}:${ss}`}
          className="bg-blue-50"
        />
        <ResultCard
          icon={CheckCircle2}
          label="Acertos"
          value={`${correctAnswers}/${totalCards}`}
          detail={
            answeredQuestions > 0
              ? `${percentage}% de aproveitamento`
              : undefined
          }
          className="bg-green-50"
        />
        <ResultCard
          icon={SkipForward}
          label="Questões puladas"
          value={skippedQuestions.toString()}
          className="bg-orange-50"
        />
      </div>

      <div className="space-y-3 w-full max-w-md">
        <Button
          onClick={onRestart}
          className="w-full rounded-full primary-border"
          size="lg"
        >
          Praticar novamente
        </Button>
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full rounded-full secondary-border"
          size="lg"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}

interface ResultCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  detail?: string;
  className?: string;
}

function ResultCard({
icon: Icon,
  label,
  value,
  detail,
  className,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl input-border bg-background p-6 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/50">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
