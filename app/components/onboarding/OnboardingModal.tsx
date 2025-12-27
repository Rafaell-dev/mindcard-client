"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { OnboardingProgress } from "./OnboardingProgress";
import { OnboardingQuestion } from "./OnboardingQuestion";
import { useOnboarding } from "@/app/contexts/OnboardingContext";
import { getPerguntas, salvarRespostas } from "@/app/api/v1/onboarding/actions";
import type {
  PerguntaOnboarding,
  RespostaOnboarding,
} from "@/app/api/v1/onboarding/types";
import {
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";

/**
 * Modal de onboarding com questionário dinâmico
 * Exibido automaticamente quando onboardingCompleto === false
 */
export function OnboardingModal() {
  const { showOnboardingModal, setOnboardingComplete } = useOnboarding();

  // State
  const [perguntas, setPerguntas] = useState<PerguntaOnboarding[]>([]);
  const [respostas, setRespostas] = useState<Map<string, RespostaOnboarding>>(
    new Map()
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions on mount
  useEffect(() => {
    if (showOnboardingModal) {
      loadPerguntas();
    }
  }, [showOnboardingModal]);

  const loadPerguntas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPerguntas();
      // Sort by order
      const sorted = [...data].sort((a, b) => a.ordem - b.ordem);
      setPerguntas(sorted);
    } catch (err) {
      console.error("Failed to load onboarding questions:", err);
      setError("Não foi possível carregar as perguntas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Current question
  const currentPergunta = perguntas[currentStep];
  const isLastStep = currentStep === perguntas.length - 1;
  const isFirstStep = currentStep === 0;

  // Check if current question is answered
  const isCurrentAnswered = currentPergunta
    ? respostas.has(currentPergunta.id)
    : false;

  // Check if current question can be skipped
  const canProceed = currentPergunta
    ? !currentPergunta.obrigatoria || isCurrentAnswered
    : false;

  // Handle answer change
  const handleRespostaChange = useCallback((resposta: RespostaOnboarding) => {
    setRespostas((prev) => {
      const next = new Map(prev);
      next.set(resposta.perguntaId, resposta);
      return next;
    });
  }, []);

  // Navigation
  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // Submit answers
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      await salvarRespostas({
        respostas: Array.from(respostas.values()),
      });

      toast.success("Onboarding concluído!", {
        description: "Bem-vindo ao MindCard! 🎉",
      });

      setOnboardingComplete();
    } catch (err) {
      console.error("Failed to submit onboarding answers:", err);
      toast.error("Erro ao salvar respostas", {
        description: "Tente novamente em alguns segundos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render if not showing
  if (!showOnboardingModal) {
    return null;
  }

  return (
    <>
      {/* Custom backdrop with blur */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      <Dialog open={showOnboardingModal} modal={false}>
        <DialogContent
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="sm:max-w-lg z-50 gap-0 p-0 overflow-hidden"
        >
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-bold">
                Vamos começar
              </DialogTitle>
              <DialogDescription className="text-base">
                Responda algumas perguntas rápidas para melhorar sua experiência
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground">Carregando perguntas...</p>
              </div>
            )}

            {/* Error state */}
            {error && !isLoading && (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <p className="text-destructive text-center">{error}</p>
                <Button onClick={loadPerguntas} variant="outline">
                  Tentar novamente
                </Button>
              </div>
            )}

            {/* Questions */}
            {!isLoading && !error && perguntas.length > 0 && (
              <>
                {/* Progress */}
                <OnboardingProgress
                  currentStep={currentStep + 1}
                  totalSteps={perguntas.length}
                  className="mb-8"
                />

                {/* Question */}
                <div className="min-h-[200px]">
                  <OnboardingQuestion
                    pergunta={currentPergunta}
                    resposta={respostas.get(currentPergunta.id)}
                    onRespostaChange={handleRespostaChange}
                  />
                </div>
              </>
            )}
          </div>

          {/* Footer with navigation */}
          {!isLoading && !error && perguntas.length > 0 && (
            <div className="p-6 pt-0 flex gap-3">
              {/* Previous button */}
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep || isSubmitting}
                className={cn(
                  "flex-1 h-12 rounded-full font-semibold transition-all secondary-border",
                  isFirstStep && "opacity-0 pointer-events-none"
                )}
              >
                Anterior
              </Button>

              {/* Next / Submit button */}
              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className="flex-1 h-12 rounded-full font-semibold bg-gradient-to-r from-primary to-primary/90 primary-border"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      Concluir
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="flex-1 h-12 rounded-full font-semibold primary-border"
                >
                  Próximo
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
