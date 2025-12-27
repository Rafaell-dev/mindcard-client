"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface OnboardingContextValue {
  /** Whether the user has completed onboarding */
  isOnboardingComplete: boolean;
  /** Whether the onboarding modal should be shown */
  showOnboardingModal: boolean;
  /** Set onboarding as complete */
  setOnboardingComplete: () => void;
  /** Trigger the onboarding modal to open */
  openOnboardingModal: () => void;
  /** Close the onboarding modal */
  closeOnboardingModal: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

interface OnboardingProviderProps {
  children: ReactNode;
  /** Initial onboarding completion status from server */
  initialOnboardingComplete?: boolean;
}

export function OnboardingProvider({
  children,
  initialOnboardingComplete = true,
}: OnboardingProviderProps) {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(
    initialOnboardingComplete
  );
  const [showOnboardingModal, setShowOnboardingModal] = useState(
    !initialOnboardingComplete
  );

  const setOnboardingComplete = useCallback(() => {
    setIsOnboardingComplete(true);
    setShowOnboardingModal(false);
  }, []);

  const openOnboardingModal = useCallback(() => {
    setShowOnboardingModal(true);
  }, []);

  const closeOnboardingModal = useCallback(() => {
    // Only allow closing if onboarding is complete
    if (isOnboardingComplete) {
      setShowOnboardingModal(false);
    }
  }, [isOnboardingComplete]);

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        showOnboardingModal,
        setOnboardingComplete,
        openOnboardingModal,
        closeOnboardingModal,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
}
