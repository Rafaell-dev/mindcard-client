import { Button } from "@/app/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface PracticeHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PracticeHeader({
  searchQuery,
  onSearchChange,
}: PracticeHeaderProps) {
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
      <div className="flex grid grid-cols-12 items-center gap-6">
        <div className="col-span-12 md:col-span-8">
          <label className="group flex h-14 items-center gap-3 rounded-full input-border bg-background px-5">
            <input
              type="text"
              placeholder="Pesquisar"
              className="flex-1 focus-visible:outline-none"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Image
              src="/icons/search.svg"
              alt="Search"
              width={18}
              height={18}
            />
          </label>
        </div>
        <div className="col-span-12 md:col-span-4 flex items-center gap-4">
          <Link href="/practice/novo" className="w-full">
            <Button
              className="w-full rounded-full font-bold primary-border"
              size="xl"
            >
              Criar Mindcard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
