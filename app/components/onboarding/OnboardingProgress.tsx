"use client";

import { cn } from "@/app/lib/utils";

interface OnboardingProgressProps {
  /** Current step (1-indexed) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Class name for customization */
  className?: string;
}

/**
 * Step indicator for onboarding progress
 * Shows current position in the questionnaire
 */
export function OnboardingProgress({
  currentStep,
  totalSteps,
  className,
}: OnboardingProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="flex justify-between items-center mt-2">
        <p className="text-sm text-muted-foreground">
          Pergunta {currentStep} de {totalSteps}
        </p>
      </div>
    </div>
  );
}
