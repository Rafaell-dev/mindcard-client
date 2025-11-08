import type { ReactNode } from "react";

export default function MindcardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex flex-col min-h-screen w-full px-4 pb-28 pt-8 sm:px-6">
        {children}
      </div>
    </div>
  );
}
