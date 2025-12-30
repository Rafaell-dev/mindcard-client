"use server";
import { cache } from "react";
import { apiGet } from "../..";
import { University } from "./types";

export const searchUniversities = cache(async (query: string) => {
  if (!query || query.length < 3) return [];
  try {
    const results = await apiGet<University[]>(`faculdades`, {
      search: query,
      limit: 20,
    });
    return results;
  } catch (error) {
    console.error("Failed to search universities:", error);
    return [];
  }
});
