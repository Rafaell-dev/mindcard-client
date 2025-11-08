import { FloatingNavbar } from "@/components/common/floating-navbar";
import type { ReactNode } from "react";

export default function MindcardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen">
      {children}
      <FloatingNavbar />
    </main>
  );
}
