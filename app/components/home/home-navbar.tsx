const NAV_ITEMS = Array.from({ length: 4 });

export function HomeNavbar() {
  return (
    <nav className="sticky bottom-4 z-10 mx-auto w-full max-w-md rounded-full border border-border bg-card/95 px-6 py-3 shadow-[0_12px_24px_rgba(41,43,45,0.15)] backdrop-blur lg:static lg:max-w-none lg:rounded-3xl lg:px-8 lg:py-4 lg:shadow-sm">
      <div className="grid grid-cols-4 gap-4">
        {NAV_ITEMS.map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 rounded-full bg-transparent py-1"
          >
            <span className="h-6 w-6 rounded-full bg-foreground/15" />
            <span className="h-2 w-12 rounded-full bg-foreground/10" />
          </div>
        ))}
      </div>
    </nav>
  );
}
