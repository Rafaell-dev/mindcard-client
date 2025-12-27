import { FloatingNavbar } from "@/app/components/common/floating-navbar";
import { OnboardingWrapper } from "@/app/components/onboarding";
import { getSession } from "@/app/lib/session";
import { getUser } from "@/app/actions/user";
import type { ReactNode } from "react";

export default async function MindcardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  let onboardingCompleto = true;

  if (session?.userId) {
    const user = await getUser(session.userId);
    onboardingCompleto = user?.onboardingCompleto ?? true;
  }

  return (
    <OnboardingWrapper onboardingCompleto={onboardingCompleto}>
      <div className="flex flex-col min-h-screen">
        {children}
        <FloatingNavbar />
      </div>
    </OnboardingWrapper>
  );
}
