"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/practice/question-cards/question-card";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Image from "next/image";

export default function PracticePlayPage({
  params,
}: {
  params: Promise<{ mindcardId: string }>;
}) {
  const router = useRouter();
  // mindcardId available for future fetching
  React.use(params);

  // Mock state
  const [type] = React.useState<"open" | "multiple-choice" | "alternative">(
    "open"
  );
  const [question] = React.useState("O que é inteligência artificial?");
  const [options] = React.useState([
    "Opção A",
    "Opção B",
    "Opção C",
    "Opção D",
  ]);
  const [answer, setAnswer] = React.useState("");
  // streak placeholder for future dynamic badge logic
  const [difficulty] = React.useState<"Fácil" | "Médio" | "Difícil">("Médio");

  // progress mock (0-100)
  const [progress] = React.useState(15); // static for now

  // timer mm:ss
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const handleVerify = () => {
    setRevealed(true);
  };

  const close = () => router.back();

  const [revealed, setRevealed] = React.useState(false);

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
            className="absolute left-0 top-0 h-full rounded-full bg-jet-black"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-4" />
      </div>

      {/* Badges */}
      <div className="flex items-center justify-center gap-3">
        <Badge>{difficulty}</Badge>
        <Badge className="flex justify-center items-center space-x-1">
          <span>{mm}:{ss} </span> <Image src="/icons/clock.svg" alt="Timer" width={16} height={16} />
        </Badge>
        <Badge className="flex justify-center items-center space-x-1">
          <span>4</span> <Image src="/icons/flame_black.svg" alt="Flame" width={16} height={16} />
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
            onClick={revealed ? () => console.log("next-card") : handleVerify}
            className="w-full rounded-full primary-border"
            size="lg"
            disabled={!revealed && answer.trim().length < 3}
          >
            {revealed ? "Próximo card" : "Verificar"}
          </Button>
          <Button
            type="button"
            onClick={() => console.log("nao sei")}
            className="w-full text-foreground font-bold secondary-border"
            size="lg"
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
