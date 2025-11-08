import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";

type MindcardCardProps = {
  title: string;
  difficulty: string;
  difficultyColor: string;
  progressLabel: string;
  cardsLabel: string;
  progress: number;
  streakCount?: number;
  icon: ReactNode;
  backgroundClassName: string;
  accentElement?: ReactNode;
  className?: string;
};

export function MindcardCard({
  title,
  difficulty,
  difficultyColor,
  progressLabel,
  cardsLabel,
  progress,
  streakCount = 0,
  icon,
  backgroundClassName,
  accentElement,
  className,
}: MindcardCardProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-4xl px-6 py-5 min-h-40 justify-between flex flex-col",
        backgroundClassName,
        className,
      )}
    >
      {accentElement ? (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-28 opacity-50">
          {accentElement}
        </div>
      ) : null}

      <div className="relative z-10 flex items-start justify-between gap-4 w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center justify-center text-2xl">
            {icon}
          </div>
          <div className="space-y-1 flex w-full justify-between">
            <h3 className="text-lg font-bold">{title}</h3>
            <div className="flex items-center gap-3 text-sm font-light text-jet-black">
              <span
                className="rounded-full px-3 py-1"
                style={{ backgroundColor: difficultyColor }}
              >
                <h2>{difficulty}</h2>
              </span>
              <span className="flex items-center gap-1 rounded-full px-3 py-1" style={{ backgroundColor: difficultyColor }}>
                <h2>{streakCount}</h2> <Image src="/icons/flame_black.svg" alt="Flame" width={16} height={16} />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 space-y-2">
        <h2 className="text-2xl font-bold">
          {progressLabel} <span className="text-sm">de {cardsLabel}</span>
        </h2>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-smoky-white">
          <div
            className="h-full rounded-full bg-jet-black"
            style={{
              width: `${clampedProgress}%`,
            }}
          />
        </div>
      </div>
    </article>
  );
}
