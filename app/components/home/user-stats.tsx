import { cn } from "@/app/lib/utils";
import Image from "next/image";

type UserStatsProps = {
  level?: number;
  totalXp?: number;
  nextLevelXp?: number;
  streak?: number;
  mindcardsCreated?: number;
  className?: string;
};

const DEFAULT_LEVEL = 4;
const DEFAULT_TOTAL_XP = 1400;
const DEFAULT_NEXT_LEVEL_XP = 2000;
const DEFAULT_STREAK = 19;
const DEFAULT_MINDCARDS_CREATED = 34;

export function UserStats({
  level = DEFAULT_LEVEL,
  totalXp = DEFAULT_TOTAL_XP,
  nextLevelXp = DEFAULT_NEXT_LEVEL_XP,
  streak = DEFAULT_STREAK,
  mindcardsCreated = DEFAULT_MINDCARDS_CREATED,
  className,
}: UserStatsProps) {
  const targetXp = Math.max(nextLevelXp, 1);
  const progress = Math.max(
    0,
    Math.min(100, Math.round((totalXp / targetXp) * 100))
  );

  return (
    <section className={cn("grid gap-4 md:grid-cols-2", className)}>
      <article className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-old-flax px-6 py-7 text-sm min-h-48 md:col-span-2 sm:px-8">
        <Image
          src="/bg-card/lightning.svg"
          alt="Lightning background"
          width={150}
          height={150}
          className="pointer-events-none absolute right-[-0px] top-1/2 -translate-y-1/2"
        />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/lightning.svg"
              alt="XP Icon"
              width={24}
              height={24}
            />
            <h2 className="text-2xl font-black">
              Experiência
            </h2>
          </div>
        </div>
        <div className="relative z-10 mt-6 space-y-4 md:mt-0">
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
            <h2 className="text-4xl font-black tracking-tight">
              Nível {level}
            </h2>
            <p className="text-lg font-bold sm:text-xl">
              {totalXp}xp / {targetXp}xp
            </p>
          </div>
          <div className="space-y-2">
            <div
              className="relative h-2 w-full overflow-hidden rounded-full bg-white/60"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[#1C1C1E]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </article>

      <article className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-rocket-orange px-6 py-7 text-sm min-h-48 sm:px-8">
        <Image
          src="/bg-card/rocket.svg"
          alt="Rocket background"
          width={80}
          height={80}
          className="pointer-events-none absolute right-[-0px] top-1/2 -translate-y-1/2 z-0"
        />
        <div className="relative z-10 flex items-center justify-between">
          <Image src="/icons/rocket.svg" alt="XP Icon" width={28} height={28} />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-6xl font-black">{streak}</h2>
          <h2 className="text-4xl font-black">Acertos seguidos</h2>
        </div>
      </article>

      <article className="relative flex flex-col justify-between overflow-hidden rounded-[32px] bg-task-blue px-6 py-7 text-sm min-h-48 sm:px-8">
        <Image
          src="/bg-card/task.svg"
          alt="Task background"
          width={50}
          height={50}
          className="pointer-events-none absolute right-[-0px] top-1/2 -translate-y-1/2 z-0"
        />
        <div className="relative z-10 flex items-center justify-between">
          <Image src="/icons/task.svg" alt="XP Icon" width={28} height={28} />
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-6xl font-black">{mindcardsCreated}</h2>
          <h2 className="text-4xl font-black">Mindcards criados</h2>
        </div>
      </article>
    </section>
  );
}
