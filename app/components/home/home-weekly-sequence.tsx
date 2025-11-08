const DAYS = Array.from({ length: 7 });

export function HomeWeeklySequence() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="h-4 w-24 rounded-full bg-foreground/10" />
        <span className="h-4 w-20 rounded-full bg-foreground/10" />
      </div>
      <div className="mb-6 h-12 rounded-2xl bg-muted/40" />
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {DAYS.map((_, index) => (
          <div
            key={index}
            className="aspect-square rounded-full border border-border bg-muted/60"
          />
        ))}
      </div>
    </section>
  );
}
