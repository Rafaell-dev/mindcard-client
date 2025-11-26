import Image from "next/image";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/lib/utils";

type ProgressTrackerProps = {
  streakCount?: number;
  currentDate?: Date;
  onPractice?: () => void;
  className?: string;
};

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  }).format(date);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

const DAY_INITIALS = ["D", "S", "T", "Q", "Q", "S", "S"];

export function ProgressTracker({
  streakCount = 0,
  currentDate = new Date(),
  onPractice,
  className,
}: ProgressTrackerProps) {
  const todayIndex = currentDate.getDay();
  const dateLabel = formatDateLabel(currentDate);
  const normalizedToday = startOfDay(currentDate);
  const activeSpan = Math.max(0, Math.min(7, streakCount));
  const activeStart = activeSpan
    ? startOfDay(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - (activeSpan - 1)
        )
      )
    : null;

  const baseSunday = startOfDay(
    new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - todayIndex
    )
  );

  const weekDays = DAY_INITIALS.map((label, index) => {
    const date = new Date(baseSunday);
    date.setDate(baseSunday.getDate() + index);
    const normalizedDate = startOfDay(date);

    const isActive =
      !!activeStart &&
      normalizedDate >= activeStart &&
      normalizedDate <= normalizedToday;

    return {
      label,
      date,
      isToday: index === todayIndex,
      isActive,
    };
  });

  return (
    <section
      className={cn(
        "grid gap-6 rounded-3xl py-6 lg:items-center lg:gap-10",
        className
      )}
    >
      <div className="flex flex-col w-full gap-4">
        <div className="flex items-center justify-between text-sm font-black uppercase tracking-[0.16em]">
          <div className="flex items-center gap-3 text-foreground">
            <Image
              src="/icons/flame.svg"
              alt="Flame"
              width={32}
              height={32}
              className="h-10 w-10"
            />
            <div>
              {/* <p className="font-medium text-foreground">Sequência</p> */}
              <h2 className="text-4xl font-black">{streakCount}</h2>
              {/* <p className="text-sm text-foreground">dias consecutivos</p> */}
            </div>
          </div>
          <span>{dateLabel}</span>
        </div>

        <div className="space-y-1 w-full">
          <ul className="grid grid-cols-7 w-full items-center text-center text-sm font-black uppercase tracking-[0.2em]">
            {weekDays.map(({ label }, index) => (
              <li
                key={`label-${label}-${index}`}
                className="flex justify-center"
              >
                {label}
              </li>
            ))}
          </ul>

          <div className="rounded-full bg-accent px-1">
            <ul className="grid grid-cols-7 h-12 items-center gap-2">
              {weekDays.map(({ label, date, isActive, isToday }) => (
                <li
                  key={label + date.toISOString()}
                  className="flex justify-center"
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-black transition-all duration-200",
                      isActive ? "bg-primary text-white" : "dark:text-white"
                    )}
                    aria-current={isToday ? "date" : undefined}
                  >
                    {new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                    }).format(date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
