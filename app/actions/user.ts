"use server";

import { cookies } from "next/headers";
import api from "@/app/api";

const COOKIE_NAME = "token";

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
};

type UserActionState = {
  success?: boolean;
  error?: string;
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

export async function getUser(userId: string): Promise<User | null> {
  try {
    const headers = await getAuthHeaders();
    const user = await api.get<User>(
      `usuario/listar/${userId}`,
      undefined,
      headers
    );
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
    const headers = await getAuthHeaders();

    const body: Record<string, unknown> = {
      nome,
      email,
      idioma,
    };

    if (faculdadeId) {
      body.faculdadeId = faculdadeId;
    }

    await api.patch(`usuario/atualizar/${userId}`, body, headers);

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "FAILED_TO_UPDATE" };
  }
}
