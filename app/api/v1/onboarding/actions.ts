"use server";

import { cache } from "react";
import { apiGet, apiPost } from "../../index";
import type {
  PerguntaOnboarding,
  SalvarRespostasRequest,
  OnboardingStatus,
} from "./types";

/**
 * Busca todas as perguntas ativas do onboarding
 * Endpoint público - não requer autenticação
 */
export const getPerguntas = cache(async (): Promise<PerguntaOnboarding[]> => {
  try {
    const perguntas = await apiGet<PerguntaOnboarding[]>(
      "onboarding/perguntas"
    );
    return perguntas;
  } catch (error) {
    console.error("Failed to fetch onboarding questions:", error);
    return [];
  }
});

/**
 * Salva as respostas do usuário ao questionário de onboarding
 * Endpoint protegido - requer autenticação
 */
export async function salvarRespostas(
  request: SalvarRespostasRequest
): Promise<void> {
  try {
    await apiPost("onboarding/responder", request);
  } catch (error) {
    console.error("Failed to save onboarding responses:", error);
    throw error;
  }
}

/**
 * Busca o status de conclusão do onboarding do usuário
 * Endpoint protegido - requer autenticação
 */
export const getOnboardingStatus = cache(
  async (): Promise<OnboardingStatus | null> => {
    try {
      const status = await apiGet<OnboardingStatus>("onboarding/status");
      return status;
    } catch (error) {
      console.error("Failed to fetch onboarding status:", error);
      return null;
    }
  }
);
