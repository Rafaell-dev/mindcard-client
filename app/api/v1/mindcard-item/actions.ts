"use server";

import { cache } from "react";
import { apiGet } from "../..";
import { MindcardItem } from "./types";

export const getMindcardItemsByMindcardId = cache(
  async (mindcardId: string) => {
    try {
      const mindcardItems = await apiGet<MindcardItem[]>(
        `card/listar_por_mindcard/${mindcardId}`
      );
      return mindcardItems;
    } catch (error) {
      console.error("Failed to fetch mindcard items:", error);
      return [];
    }
  }
);
