"use client";

import { Bot, PenSquare, Rocket, Sparkle } from "lucide-react";
import Link from "next/link";
import { use, useState, useMemo, useEffect } from "react";

import { MindcardCard } from "./components/mindcard-card";
import { PracticeHeader } from "./components/practice-header";
import { getMindcardsByUserId } from "@/app/api/v1/mindcard/route";

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

export default function Practice({ searchParams }: PracticePageProps) {
  const params = use(searchParams);
  const userId = params.userId || "ff9ff165-557f-427f-8c5b-aa1e52453003";

  // State for search
  const [searchQuery, setSearchQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mindcardsData, setMindcardsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load mindcards on mount
  useEffect(() => {
    getMindcardsByUserId(userId).then((data) => {
      setMindcardsData(data);
      setLoading(false);
    });
  }, [userId]);

  // Map API data to UI model and apply filters
  const mindcards = useMemo(() => {
    // Map data
    const mapped = mindcardsData.map((card, index) => {
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

    // Filter by search query (client-side)
    const filtered = searchQuery
      ? mapped.filter((card) =>
          card.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : mapped;

    // Sort alphabetically by title
    return filtered.sort((a, b) => a.title.localeCompare(b.title));
  }, [mindcardsData, searchQuery]);

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Carregando mindcards...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-col w-full gap-10 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <PracticeHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {mindcards.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-jet-black">Seus mindcards</h2>
          <div className="flex flex-col gap-4">
            {mindcards.map((card) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-muted-foreground">
            {searchQuery
              ? "Nenhum mindcard encontrado com esse nome"
              : "Nenhum mindcard disponível"}
          </p>
        </div>
      )}
    </div>
  );
}
