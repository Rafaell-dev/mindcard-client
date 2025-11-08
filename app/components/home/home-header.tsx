"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HomeHeaderProps = {
  userName?: string;
  question?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: ReactNode;
  className?: string;
};

const defaultQuestion = "Sua sequência vale ouro! pratique já.";
const defaultActionLabel = "Praticar";

function getGreeting(date: Date) {
  const hour = date.getHours();

  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function HomeHeader({
  userName = "Rafael",
  question = defaultQuestion,
  actionLabel = defaultActionLabel,
  onAction,
  className,
}: HomeHeaderProps) {
  const router = useRouter();
  const greeting = getGreeting(new Date());
  const handleAction = () => {
    onAction?.();
    router.push("/mindcards");
  };

  return (
    <header
      className={cn(
        "relative w-full overflow-hidden rounded-b-[32px] bg-accent py-8 px-4 sm:px-6 md:px-10 lg:py-12",
        className
      )}
    >
      <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="">
            <h2 className="text-2xl font-black transition-colors">
              {greeting},
            </h2>
            <h1 className="text-3xl font-black text-foreground transition-colors sm:text-4xl lg:text-5xl">
              {userName}
            </h1>
          </div>
          <p className="text-base text-foreground/70 transition-colors sm:text-lg">
            {question}
          </p>
        </div>

        <div className="w-full max-w-md space-y-3 lg:max-w-xs">
          <Button onClick={handleAction} className="w-full primary-border rounded-full" size="lg">
            <span className="text-base font-black">
              {actionLabel}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
