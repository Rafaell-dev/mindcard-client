"use server";

import { cache } from "react";
import api from "../..";
import { Mindcard, MindcardResponse } from "./types";

export const getMindcardsByUserId = cache(async (userId: string) => {
  try {
    const mindcards = await api.get<Mindcard[]>(
      `mindcard/listar_por_usuario/${userId}`
    );
    return mindcards;
  } catch (error) {
    console.error("Failed to fetch mindcards:", error);
    return [];
  }
});

export const getMindcardById = cache(async (mindcardId: string) => {
  try {
    const mindcard = await api.get<Mindcard>(`mindcard/listar/${mindcardId}`);
    return mindcard;
  } catch (error) {
    console.error("Failed to fetch mindcard:", error);
    return null;
  }
});

export const createMindcard = async (formData: FormData) => {
  try {
    const response = await fetch(`${api.baseUrl}/mindcard/criar`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MindcardResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create mindcard:", error);
    throw error;
  }
};

export const updateMindcard = async (
  mindcardId: string,
  formData: FormData
) => {
  try {
    const data = await api.patch<MindcardResponse>(
      `mindcard/atualizar/${mindcardId}`,
      formData
    );
    return data;
  } catch (error) {
    console.error("Failed to update mindcard:", error);
    throw error;
  }
};
