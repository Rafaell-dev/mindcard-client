"use server";

import { authGet, authPatch } from "@/app/api/authApi";

export type User = {
  id: string;
  email: string;
  nome?: string;
  usuario?: string;
  idioma: string;
  dataRegistro: string;
  xpTotal: number;
  sequenciaAtual: number;
  sequenciaRecorde: number;
  faculdadeNome?: string;
  onboardingCompleto?: boolean;
};

type UserActionState = {
  success?: boolean;
  error?: string;
};

export async function getUser(userId: string): Promise<User | null> {
  try {
    const user = await authGet<User>(`usuario/listar/${userId}`);
    return user;
  } catch (error: unknown) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

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

    await authPatch(`usuario/atualizar/${userId}`, body);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "FAILED_TO_UPDATE" };
  }
}
