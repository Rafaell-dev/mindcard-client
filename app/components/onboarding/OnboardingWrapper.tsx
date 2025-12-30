"use client";

import { OnboardingProvider } from "@/app/contexts/OnboardingContext";
import { OnboardingModal } from "@/app/components/onboarding";
import type { ReactNode } from "react";

interface OnboardingWrapperProps {
  children: ReactNode;
  /** Whether onboarding is complete (from server) */
  onboardingCompleto: boolean;
}

/**
 * Client-side wrapper that provides onboarding context and modal
 * Must receive onboardingCompleto from server component
 */
export function OnboardingWrapper({
  children,
  onboardingCompleto,
}: OnboardingWrapperProps) {
  return (
    <OnboardingProvider initialOnboardingComplete={onboardingCompleto}>
      {children}
      <OnboardingModal />
    </OnboardingProvider>
  );
}
