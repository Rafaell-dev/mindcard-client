"use server";

import { cache } from "react";
import { apiGet, apiPatch } from "../../index";
import { User } from "./types";

type UserActionState = {
  success?: boolean;
  error?: string;
};

/**
 * Busca dados do usuário pelo ID
 * Utiliza cache para evitar múltiplas chamadas
 */
export const getUser = cache(async (userId: string): Promise<User | null> => {
  try {
    const user = await apiGet<User>(`usuario/listar/${userId}`);
    return user;
  } catch (error: unknown) {
    console.error("Failed to fetch user:", error);
    return null;
  }
});

/**
 * Server Action para atualizar dados do usuário
 */
export async function updateUserAction(
  prevState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const userId = formData.get("userId") as string;
  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const faculdadeId = formData.get("faculdadeId") as string | null;
  const idioma = formData.get("idioma") as string;

  try {
    const body: Record<string, unknown> = {
      nome,
      email,
      idioma,
    };

    if (faculdadeId) {
      body.faculdadeId = faculdadeId;
    }

    await apiPatch(`usuario/atualizar/${userId}`, body);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "FAILED_TO_UPDATE" };
  }
}
