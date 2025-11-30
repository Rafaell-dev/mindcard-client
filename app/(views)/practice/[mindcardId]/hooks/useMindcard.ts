"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Mindcard } from "@/app/api/v1/mindcard/types";
import type { MindcardItem } from "@/app/api/v1/mindcard-item/types";
import {
  getMindcardById,
  createMindcard,
  updateMindcard,
} from "@/app/api/v1/mindcard/route";
import { getMindcardItemsByMindcardId } from "@/app/api/v1/mindcard-item/route";
import { getFilenameFromUrl } from "../lib/utils";

interface UseMindcardProps {
  mindcardId: string;
  userId: string;
}

interface UseMindcardReturn {
  mindcard: Mindcard | null;
  title: string;
  cards: MindcardItem[];
  loadingCards: boolean;
  loading: boolean;
  isCreationMode: boolean;
  sourceFileName: string | null;
  initialPrompt: string;
  setTitle: (title: string) => void;
  setCards: React.Dispatch<React.SetStateAction<MindcardItem[]>>;
  createNewMindcard: (
    file: File,
    prompt: string,
    cardTypes: ("ABERTA" | "ALTERNATIVA" | "MULTIPLA_ESCOLHA")[]
  ) => Promise<void>;
  updateTitle: (newTitle: string) => Promise<void>;
}

/**
 * Hook para gerenciar mindcard
 * Responsabilidade: carregar, criar e atualizar mindcards
 */
export function useMindcard({
  mindcardId,
  userId,
}: UseMindcardProps): UseMindcardReturn {
  const router = useRouter();
  const [mindcard, setMindcard] = useState<Mindcard | null>(null);
  const [title, setTitle] = useState("Novo Mindcard");
  const [cards, setCards] = useState<MindcardItem[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loading, setLoading] = useState(false);

  const isCreationMode = mindcardId === "novo";

  // Load mindcard data
  useEffect(() => {
    if (isCreationMode) {
      setTitle("Novo Mindcard");
      return;
    }

    const loadMindcard = async () => {
      const data = await getMindcardById(mindcardId);
      if (data) {
        setMindcard(data);
        setTitle(data.titulo);

        // Load cards
        setLoadingCards(true);
        try {
          const items = await getMindcardItemsByMindcardId(mindcardId);
          setCards(items);
        } catch (error) {
          console.error("Failed to fetch mindcard items:", error);
          toast.error("Falha ao carregar os cards");
        } finally {
          setLoadingCards(false);
        }
      } else {
        toast.error("Mindcard não encontrado");
        router.push("/mindcards");
      }
    };

    loadMindcard();
  }, [mindcardId, isCreationMode, router]);

  const createNewMindcard = async (
    file: File,
    prompt: string,
    cardTypes: ("ABERTA" | "ALTERNATIVA" | "MULTIPLA_ESCOLHA")[]
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titulo", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("usuarioId", userId);
      formData.append("tipoGeracao", "FLASHCARDS");
      formData.append("fonteArquivo", file);
      if (prompt) {
        formData.append("promptPersonalizado", prompt);
      }
      // Add card types as JSON array
      formData.append("tipoCards", JSON.stringify(cardTypes));

      const response = await createMindcard(formData);
      toast.success("Mindcard criado com sucesso! Processando...");
      router.push(`/practice/${response.data.id}`);
    } catch (error) {
      console.error("Failed to create mindcard:", error);
      toast.error("Falha ao criar mindcard. Por favor, tente novamente.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateTitle = async (newTitle: string) => {
    if (isCreationMode) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("titulo", newTitle);

      await updateMindcard(mindcardId, formData);
      setTitle(newTitle);
      toast.success("Título atualizado com sucesso!");
    } catch (error) {
      console.error("Failed to update title:", error);
      toast.error("Falha ao atualizar o título");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get source filename from mindcard
  const sourceFileName = mindcard?.fonteArquivo
    ? getFilenameFromUrl(mindcard.fonteArquivo)
    : null;

  // Get prompt from mindcard
  const initialPrompt = mindcard?.promptPersonalizado || "";

  return {
    mindcard,
    title,
    cards,
    loadingCards,
    loading,
    isCreationMode,
    sourceFileName,
    initialPrompt,
    setTitle,
    setCards,
    createNewMindcard,
    updateTitle,
  };
}
