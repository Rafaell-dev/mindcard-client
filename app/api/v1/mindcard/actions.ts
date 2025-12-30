"use server";

import { cache } from "react";
import { apiGet, apiPost, apiPatch } from "../../index";
import { Mindcard, MindcardResponse } from "./types";

/**
 * Busca mindcards de um usuário específico.
 * Utiliza cache do React para deduplicação de chamadas.
 */
export const getMindcardsByUserId = cache(async (userId: string) => {
  try {
    const mindcards = await apiGet<Mindcard[]>(
      `mindcard/listar_por_usuario/${userId}`
    );
    return mindcards;
  } catch (error) {
    console.error("Failed to fetch mindcards:", error);
    return [];
  }
});

/**
 * Busca um mindcard pelo ID.
 * Utiliza cache do React para deduplicação de chamadas.
 */
export const getMindcardById = cache(async (mindcardId: string) => {
  try {
    const mindcard = await apiGet<Mindcard>(`mindcard/listar/${mindcardId}`);
    return mindcard;
  } catch (error) {
    console.error("Failed to fetch mindcard:", error);
    return null;
  }
});

/**
 * Cria um novo mindcard.
 * utiliza FormData para envio de arquivos.
 */
export const createMindcard = async (formData: FormData) => {
  try {
    const data = await apiPost<MindcardResponse>("mindcard/criar", formData);
    return data;
  } catch (error) {
    console.error("Failed to create mindcard:", error);
    throw error;
  }
};

/**
 * Atualiza um mindcard existente.
 */
export const updateMindcard = async (
  mindcardId: string,
  formData: FormData
) => {
  try {
    const data = await apiPatch<MindcardResponse>(
      `mindcard/atualizar/${mindcardId}`,
      formData
    );
    return data;
  } catch (error) {
    console.error("Failed to update mindcard:", error);
    throw error;
  }
};
