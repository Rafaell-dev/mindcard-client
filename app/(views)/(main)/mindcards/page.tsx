import { Bot, PenSquare, Rocket, Sparkle } from "lucide-react";
import Link from "next/link";

import { MindcardCard } from "./components/mindcard-card";
import { PracticeHeader } from "./components/practice-header";
import {
  getMindcardById,
  getMindcardsByUserId,
} from "@/app/api/v1/mindcard/route";
import { Button } from "@/app/components/ui/button";

const accentGreen = (
  <svg viewBox="0 0 160 180" className="h-full w-full" aria-hidden>
    <path
      d="M120 0c24 28 48 56 48 92s-24 64-48 88-52 36-80 24S0 144 0 108 24 36 52 16 96-28 120 0Z"
      fill="rgba(76, 175, 80, 0.4)"
    />
    <circle cx="50" cy="60" r="18" fill="rgba(255,255,255,0.35)" />
    <circle cx="110" cy="130" r="26" fill="rgba(255,255,255,0.18)" />
  </svg>
);

const accentBlue = (
  <svg viewBox="0 0 160 180" className="h-full w-full" aria-hidden>
    <circle
      cx="130"
      cy="40"
      r="30"
      stroke="rgba(27,63,222,0.5)"
      strokeWidth="12"
      fill="none"
    />
    <circle
      cx="110"
      cy="110"
      r="50"
      stroke="rgba(45,106,255,0.25)"
      strokeWidth="18"
      fill="none"
    />
  </svg>
);

const accentPink = (
  <svg viewBox="0 0 160 180" className="h-full w-full" aria-hidden>
    <path
      d="M90 20c36 16 66 46 66 84s-26 62-66 68-84-22-88-58 28-76 64-94c12-6 24-8 24 0Z"
      fill="rgba(255,105,180,0.35)"
    />
    <circle
      cx="120"
      cy="60"
      r="22"
      stroke="rgba(255,255,255,0.35)"
      strokeWidth="8"
      fill="none"
    />
  </svg>
);

const accentYellow = (
  <svg viewBox="0 0 160 180" className="h-full w-full" aria-hidden>
    <path
      d="M40 0c40 6 88 28 110 64s16 72-22 96-100 28-122-6 6-104 34-130C40 16 28-4 40 0Z"
      fill="rgba(241,178,47,0.35)"
    />
    <circle
      cx="120"
      cy="80"
      r="26"
      stroke="rgba(28,28,30,0.2)"
      strokeWidth="12"
      fill="none"
    />
  </svg>
);

const THEMES = [
  { bg: "bg-[#B8EB6C]", color: "#71B808", icon: Bot, accent: accentGreen },
  { bg: "bg-[#A3C8F9]", color: "#4558C8", icon: Rocket, accent: accentBlue },
  { bg: "bg-[#F8A8D5]", color: "#FF2090", icon: Sparkle, accent: accentPink },
  {
    bg: "bg-[#FFD677]",
    color: "#E3A553",
    icon: PenSquare,
    accent: accentYellow,
  },
];

type PracticePageProps = {
  searchParams: Promise<{ userId?: string }>;
};

export default async function Practice({ searchParams }: PracticePageProps) {
  const params = await searchParams;
  const userId = params.userId || "a15f6a4e-3f83-4aec-88e5-b953a758cd0b";
  const mindcardsData = await getMindcardsByUserId(userId);

  // Map API data to UI model
  const mindcards = mindcardsData.map((card, index) => {
    const theme = THEMES[index % THEMES.length];
    const Icon = theme.icon;

    // Mocking progress/difficulty if missing from API for now
    const progress = card.progresso ?? Math.floor(Math.random() * 100);
    const totalCards = card.totalCards ?? 20;
    const difficulty = card.dificuldade ?? "Médio";
    const streakCount = card.sequencia ?? 0;

    return {
      id: card.id,
      title: card.titulo,
      difficulty,
      difficultyColor: theme.color,
      progressLabel: `${progress}% feito`,
      cardsLabel: `${totalCards} cards`,
      progress,
      streakCount,
      icon: <Icon className="size-6" strokeWidth={2.3} />,
      backgroundClassName: theme.bg,
      accentElement: theme.accent,
    };
  });

  const lastMindcard = mindcards.length > 0 ? mindcards[0] : null;
  const otherMindcards = mindcards.length > 0 ? mindcards.slice(1) : [];

  return (
    <div className="mx-auto flex flex-col w-full gap-10 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <PracticeHeader />

      {lastMindcard && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-jet-black">
            Último mindcard feito
          </h2>
          <Link
            href={`/practice/${encodeURIComponent(lastMindcard.id)}`}
            aria-label={`Abrir ${lastMindcard.title}`}
            className="block"
          >
            <MindcardCard {...lastMindcard} />
          </Link>
        </section>
      )}

      {otherMindcards.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-jet-black">Seus mindcards</h2>
          <div className="flex flex-col gap-4">
            {otherMindcards.map((card) => (
              <Link
                key={card.id}
                href={`/practice/${encodeURIComponent(card.id)}`}
                aria-label={`Abrir ${card.title}`}
                className="block"
              >
                <MindcardCard {...card} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
