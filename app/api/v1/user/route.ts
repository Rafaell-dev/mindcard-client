"use server";
import { cache } from "react";
import api from "../..";
import { User } from "./types";
import { revalidatePath } from "next/cache";

export const getUser = cache(async (userId: string) => {
  const user = await api.get<User>(`usuario/listar/${userId}`);
  return user;
});

export const updateUser = async (formData: FormData) => {
  const userId = formData.get("userId");
  const nome = formData.get("nome");
  const faculdadeId = formData.get("faculdadeId");
  const email = formData.get("email");
  const idioma = formData.get("idioma");

  const payload: Record<string, unknown> = {
    nome,
    email,
    idioma,
  };

  if (faculdadeId) {
    payload.faculdadeId = faculdadeId;
  }

  const updatedUser = await api.patch<User>(
    `usuario/atualizar/${userId}`,
    payload
  );

  revalidatePath("/(views)/(main)/profile");
  return updatedUser;
};
