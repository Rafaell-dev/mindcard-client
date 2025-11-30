"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { QuestionCard } from "@/app/components/practice/question-cards/question-card";
import { cn } from "@/app/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";
import { getMindcardItemsByMindcardId } from "@/app/api/v1/mindcard-item/route";
import type { MindcardItem } from "@/app/api/v1/mindcard-item/types";

export default function PracticePlayPage({
  params,
}: {
  params: Promise<{ mindcardId: string }>;
}) {
  const router = useRouter();
  const resolvedParams = React.use(params);
  const mindcardId = resolvedParams.mindcardId;

  // State management
  const [cards, setCards] = React.useState<MindcardItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentCardIndex, setCurrentCardIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [revealed, setRevealed] = React.useState(false);

  // Timer
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Load cards
  React.useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        const items = await getMindcardItemsByMindcardId(mindcardId);
        setCards(items);
      } catch (error) {
        console.error("Failed to load cards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [mindcardId]);

  // Current card data
  const currentCard = cards[currentCardIndex];
  const progress =
    cards.length > 0 ? ((currentCardIndex + 1) / cards.length) * 100 : 0;
  const isLastCard = currentCardIndex === cards.length - 1;

  // Map difficulty
  const difficultyMap = {
    FACIL: "Fácil",
    MEDIO: "Médio",
    DIFICIL: "Difícil",
  } as const;

  // Timer formatting
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  // Handlers
  const handleVerify = () => {
    setRevealed(true);
  };

  const handleNext = () => {
    if (isLastCard) {
      // TODO: Show completion screen or go back
      router.back();
    } else {
      setCurrentCardIndex((prev) => prev + 1);
      setAnswer("");
      setRevealed(false);
    }
  };

  const handleDontKnow = () => {
    setRevealed(true);
  };

  const close = () => router.back();

  // Parse options for multiple choice questions
  const getOptions = (): string[] => {
    if (currentCard?.tipo !== "ABERTA" && currentCard.alternativaTexto) {
      try {
        return JSON.parse(currentCard.alternativaTexto);
      } catch {
        return [];
      }
    }
    return [];
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-muted-foreground">Carregando cards...</p>
      </div>
    );
  }

  // Empty state
  if (cards.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4">
        <p className="text-lg font-medium text-muted-foreground">
          Nenhum card disponível
        </p>
        <Button onClick={close} className="rounded-full">
          Voltar
        </Button>
      </div>
    );
  }

  const type = currentCard.tipo === "ABERTA" ? "open" : "multiple-choice";
  const question = currentCard.pergunta;
  const options = getOptions();
  const difficulty = difficultyMap[currentCard.dificuldade];

  return (
    <div className="relative mx-auto flex min-h-dvh w-full flex-col gap-4 px-4 pb-6 pt-4 sm:px-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={close}
          className="rounded-full"
        >
          <X className="size-5" />
        </Button>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-smoky-white">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-jet-black transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-4" />
      </div>

      {/* Badges */}
      <div className="flex items-center justify-center gap-3">
        <Badge>{difficulty}</Badge>
        <Badge className="flex justify-center items-center space-x-1">
          <span>
            {mm}:{ss}
          </span>
          <Image src="/icons/clock.svg" alt="Timer" width={16} height={16} />
        </Badge>
        <Badge className="flex justify-center items-center space-x-1">
          <span>
            {currentCardIndex + 1}/{cards.length}
          </span>
        </Badge>
      </div>

      {/* Card */}
      <QuestionCard
        type={type}
        question={question}
        options={options}
        value={answer}
        onChange={setAnswer}
        revealed={revealed}
        className="min-h-[360px]"
      />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pt-16">
        <div className="space-y-4 pointer-events-auto mx-auto w-full max-w-md px-4 sm:px-6">
          <Button
            onClick={revealed ? handleNext : handleVerify}
            className="w-full rounded-full primary-border"
            size="lg"
            disabled={!revealed && answer.trim().length < 3}
          >
            {revealed
              ? isLastCard
                ? "Finalizar"
                : "Próximo card"
              : "Verificar"}
          </Button>
          <Button
            type="button"
            onClick={handleDontKnow}
            className="w-full text-foreground font-bold secondary-border"
            size="lg"
            disabled={revealed}
          >
            Não sei
          </Button>
        </div>
      </div>
    </div>
  );
}

function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-background px-4 py-2 text-sm font-medium input-border",
        className
      )}
      {...props}
    />
  );
}
