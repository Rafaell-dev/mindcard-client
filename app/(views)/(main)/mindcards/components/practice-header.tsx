import Image from "next/image";

export function PracticeHeader() {
  return (
    <header className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.svg"
          alt="Mindcards"
          width={256}
          height={256}
          className="rounded-2xl"
        />
      </div>

      <label className="group flex h-14 items-center gap-3 rounded-full input-border bg-background px-5">
        <input
          type="text"
          placeholder="Pesquisar"
          className="flex-1 focus-visible:outline-none"
        />
        <Image
          src="/icons/search.svg"
          alt="Search"
          width={18}
          height={18}
        />
      </label>
    </header>
  );
}
