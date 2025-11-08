import { Bot, PenSquare, Rocket, Sparkle } from "lucide-react";
import Link from "next/link";

import { MindcardCard } from "./components/mindcard-card";
import { PracticeHeader } from "./components/practice-header";

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
    <circle cx="130" cy="40" r="30" stroke="rgba(27,63,222,0.5)" strokeWidth="12" fill="none" />
    <circle cx="110" cy="110" r="50" stroke="rgba(45,106,255,0.25)" strokeWidth="18" fill="none" />
  </svg>
);

const accentPink = (
  <svg viewBox="0 0 160 180" className="h-full w-full" aria-hidden>
    <path
      d="M90 20c36 16 66 46 66 84s-26 62-66 68-84-22-88-58 28-76 64-94c12-6 24-8 24 0Z"
      fill="rgba(255,105,180,0.35)"
    />
    <circle cx="120" cy="60" r="22" stroke="rgba(255,255,255,0.35)" strokeWidth="8" fill="none" />
  </svg>
);

const accentYellow = (
  <svg viewBox="0 0 160 180" className="h-full w-full" aria-hidden>
    <path
      d="M40 0c40 6 88 28 110 64s16 72-22 96-100 28-122-6 6-104 34-130C40 16 28-4 40 0Z"
      fill="rgba(241,178,47,0.35)"
    />
    <circle cx="120" cy="80" r="26" stroke="rgba(28,28,30,0.2)" strokeWidth="12" fill="none" />
  </svg>
);

const lastMindcard = {
  id: "flashcard-01",
  title: "Flashcard 01",
  difficulty: "Médio",
  difficultyColor: "#71B808",
  progressLabel: "40% feito",
  cardsLabel: "10 cards",
  progress: 40,
  streakCount: 4,
  icon: <Bot className="size-6" strokeWidth={2.5} />,
  backgroundClassName: "bg-[#B8EB6C]",
  accentElement: accentGreen,
};

const mindcards = [
  {
    id: "flashcard-02",
    title: "Flashcard 02",
    difficulty: "Médio",
    difficultyColor: "#4558C8",
    progressLabel: "70% feito",
    cardsLabel: "20 cards",
    progress: 70,
    streakCount: 4,
    icon: <Rocket className="size-6" strokeWidth={2.3} />,
    backgroundClassName: "bg-[#A3C8F9]",
    accentElement: accentBlue,
  },
  {
    id: "flashcard-03",
    title: "Flashcard 03",
    difficulty: "Difícil",
    difficultyColor: "#FF2090",
    progressLabel: "70% feito",
    cardsLabel: "20 cards",
    progress: 70,
    streakCount: 4,
    icon: <Sparkle className="size-6" strokeWidth={2.3} />,
    backgroundClassName: "bg-[#F8A8D5]",
    accentElement: accentPink,
  },
  {
    id: "flashcard-04",
    title: "Flashcard 04",
    difficulty: "Fácil",
    difficultyColor: "#E3A553",
    progressLabel: "70% feito",
    cardsLabel: "20 cards",
    progress: 70,
    streakCount: 4,
    icon: <PenSquare className="size-6" strokeWidth={2.3} />,
    backgroundClassName: "bg-[#FFD677]",
    accentElement: accentYellow,
  },
];

export default function Practice() {
  return (
      <div className="mx-auto flex flex-col w-full gap-10 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <PracticeHeader />

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-jet-black">
            Último mindcard feito
          </h2>
          <Link href={`/practice/${encodeURIComponent(lastMindcard.id)}`} aria-label={`Abrir ${lastMindcard.title}`} className="block">
            <MindcardCard {...lastMindcard} />
          </Link>
        </section>

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
      </div>
  );
}
