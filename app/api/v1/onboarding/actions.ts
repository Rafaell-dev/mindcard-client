"use server";

import { cache } from "react";
import api from "../../index";
import { authPost, authGet } from "../../authApi";
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
  const perguntas = await api.get<PerguntaOnboarding[]>("onboarding/perguntas");
  return perguntas;
});

/**
 * Salva as respostas do usuário ao questionário de onboarding
 * Endpoint protegido - requer autenticação
 */
export async function salvarRespostas(
  request: SalvarRespostasRequest
): Promise<void> {
  await authPost("onboarding/responder", request);
}

/**
 * Busca o status de conclusão do onboarding do usuário
 * Endpoint protegido - requer autenticação
 */
export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  const status = await authGet<OnboardingStatus>("onboarding/status");
  return status;
}
