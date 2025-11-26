
import { FloatingNavbar } from "@/app/components/common/floating-navbar";
import type { ReactNode } from "react";

export default function MindcardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {children}
      <FloatingNavbar />
    </div>
  );
}
