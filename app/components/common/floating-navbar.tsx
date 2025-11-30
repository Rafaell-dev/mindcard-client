"use client";

import type { ReactNode } from "react";

import { usePathname, useRouter } from "next/navigation";
import { HomeIcon, Plus, User } from "lucide-react";

import { cn } from "@/app/lib/utils";
import { Button } from "../ui/button";

type NavId = "home" | "action" | "profile";

type FloatingNavbarProps = {
  activeId?: NavId;
  onSelect?: (id: NavId) => void;
  className?: string;
};

type NavItem = {
  id: NavId;
  icon: ReactNode;
  label: string;
  path: string;
};

const NAV_ITEMS: NavItem[] = [
  // {
  //   id: "home",
  //   icon: <HomeIcon className="size-6" />,
  //   label: "Início",
  //   path: "/",
  // },
  {
    id: "home",
    icon: <HomeIcon className="size-6" />,
    label: "Início",
    path: "/mindcards",
  },
  // {
  //   id: "action",
  //   icon: <Plus className="size-6" />,
  //   label: "Criar",
  //   path: "/mindcards",
  // },
  {
    id: "profile",
    icon: <User className="size-6" />,
    label: "Perfil",
    path: "/profile",
  },
];

export function FloatingNavbar({
  activeId,
  onSelect,
  className,
}: FloatingNavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const resolvedActiveId: NavId = (() => {
    if (activeId) return activeId;

    const exactMatch = NAV_ITEMS.find(({ path }) => pathname === path);
    if (exactMatch) return exactMatch.id;

    const prefixMatch = NAV_ITEMS.find(
      ({ path }) => path !== "/" && pathname.startsWith(path)
    );
    if (prefixMatch) return prefixMatch.id;

    return "home";
  })();

  return (
    <nav
      aria-label="Navegação principal"
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-4",
        className
      )}
    >
      <div className="pointer-events-auto w-full max-w-md px-4">
        <div className="flex items-end justify-center">
          <div className="flex w-full items-center justify-between gap-3 rounded-[32px] px-4 py-3 input-border bg-background">
            {NAV_ITEMS.map(({ id, icon, path }) => {
              const isPrimary = id === "action";
              const isActive = id === resolvedActiveId;

              return (
                <Button
                  key={id}
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onSelect?.(id);
                    router.push(path);
                  }}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-full text-sm font-medium transition-transform",
                    isPrimary
                      ? "rounded-full px-1 py-6 text-white bg-royal-blue hover:-translate-y-0.5 hover:text-white hover:bg-royal-blue"
                      : "text-fox-gray hover:-translate-y-0.5",
                    isActive && !isPrimary && "text-jet-black"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center justify-center" aria-hidden>
                    {icon}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
