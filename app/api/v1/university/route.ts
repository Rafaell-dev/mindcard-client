"use server";
import { cache } from "react";
import api from "../..";
import { University } from "./types";

export const searchUniversities = cache(async (query: string) => {
  if (!query || query.length < 3) return [];

  const results = await api.get<University[]>(`faculdades`, {
    search: query,
    limit: 20,
  });
  return results;
});
