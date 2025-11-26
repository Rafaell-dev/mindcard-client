"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { cn } from "@/app/lib/utils";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Upload } from "lucide-react";
import Image from "next/image";
import { createMindcard, getMindcardById } from "@/app/api/v1/mindcard/route";
import { getMindcardItemsByMindcardId } from "@/app/api/v1/mindcard-item/route";
import { toast } from "sonner";
import type { Mindcard } from "@/app/api/v1/mindcard/types";
import { MindcardItem } from "@/app/api/v1/mindcard-item/types";

type MindcardPageProps = {
  params: Promise<{
    mindcardId: string;
  }>;
};

const getFilenameFromUrl = (url: string): string => {
  try {
    const urlParts = url.split("/");
    const filename = urlParts[urlParts.length - 1];
    const cleanFilename = filename.replace(/^\d+-/, "");
    return decodeURIComponent(cleanFilename);
  } catch {
    return "documento.pdf";
  }
};

export default function MindcardPage({ params }: MindcardPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceFileName, setSourceFileName] = useState<string | null>(null); // For existing mindcard files
  const [prompt, setPrompt] = useState<string>("");
  const [cards, setCards] = useState<MindcardItem[]>();
  const [loadingCards, setLoadingCards] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId] = useState("a15f6a4e-3f83-4aec-88e5-b953a758cd0b"); // TODO: Get from auth context
  const [mindcardData, setMindcardData] = useState<Mindcard | null>(null); // Stored for future use (e.g., displaying processing status)
  const [mindcardTitle, setMindcardTitle] = useState<string>("Novo Mindcard");
  const [mindcardId, setMindcardId] = useState<string | null>(null);

  // Unwrap params and fetch mindcard data
  useEffect(() => {
    const loadMindcard = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.mindcardId;
      setMindcardId(id);

      if (id !== "novo") {
        // Fetch existing mindcard details
        const data = await getMindcardById(id);
        if (data) {
          setMindcardData(data);
          setMindcardTitle(data.titulo);
          if (data.promptPersonalizado) {
            setPrompt(data.promptPersonalizado);
          }
          if (data.fonteArquivo) {
            setSourceFileName(getFilenameFromUrl(data.fonteArquivo));
          }

          // Fetch mindcard items (cards)
          setLoadingCards(true);
          try {
            const items = await getMindcardItemsByMindcardId(id);
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
      } else {
        setMindcardTitle("Novo Mindcard");
        setSourceFileName(null);
      }
    };

    loadMindcard();
  }, [params, router]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const SortableCardItem: React.FC<{ card: MindcardItem }> = ({ card }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: card.id });

    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <li
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={
          "flex items-center gap-3 rounded-2xl input-border bg-background px-5 py-4 h-14 " +
          "hover:cursor-pointer cursor-grab active:cursor-grabbing"
        }
      >
        <span className="flex items-center justify-center rounded-full">
          <Image
            src="/icons/question_card.svg"
            alt="Card Question"
            width={20}
            height={20}
          />
        </span>
        <Label className="flex-1 text-sm font-bold text-foreground">
          {card.titulo}
        </Label>
        <Image
          src="/icons/menu2.svg"
          alt="Grip Vertical"
          width={16}
          height={16}
        />
      </li>
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSourceFileName(null); // Clear the source filename when uploading a new file
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setSourceFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerateCards = async () => {
    const isCreationMode = mindcardId === "novo";

    if (isCreationMode) {
      // Create new mindcard via API
      if (!uploadedFile) {
        toast.error("Por favor, selecione um arquivo.");
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("titulo", uploadedFile.name.replace(/\.[^/.]+$/, ""));
        formData.append("usuarioId", userId);
        formData.append("tipoGeracao", "FLASHCARDS");
        formData.append("fonteArquivo", uploadedFile);
        if (prompt) {
          formData.append("promptPersonalizado", prompt);
        }

        const mindcard = await createMindcard(formData);
        toast.success("Mindcard criado com sucesso! Processando...");
        router.push(`/practice/${mindcard.data.mindcardId}`);
      } catch (error) {
        console.error("Failed to create mindcard:", error);
        toast.error("Falha ao criar mindcard. Por favor, tente novamente.");
      } finally {
        setLoading(false);
      }
    } else {
      // setCards(
      //   createInitialCards().map((card) => ({
      //     ...card,
      //     id: generateCardId(),
      //   }))
      // );
    }
  };

  const handleBack = () => {
    router.push("/mindcards");
  };

  const handleFilePicker = () => {
    fileInputRef.current?.click();
  };

  const isCreationMode = mindcardId === "novo";
  const mindcardSlug = mindcardId ?? "Mindcard";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-10 w-10 rounded-full"
        >
          <Image
            src="/icons/arrow_left.svg"
            alt="Back"
            width={10}
            height={10}
          />
        </Button>
        <h1 className="text-2xl font-bold capitalize">{mindcardTitle}</h1>
      </header>

      <section className="space-y-2">
        <Label htmlFor="mindcard-file" className="text-base font-bold">
          Fonte
        </Label>
        <input
          id="mindcard-file"
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          className="flex justify-between gap-3 rounded-2xl input-border bg-white px-4 py-3 w-full"
          variant="ghost"
          size="xl"
          onClick={handleFilePicker}
        >
          <div className="flex flex-1 items-center gap-3">
            {uploadedFile || sourceFileName ? (
              <Image
                src="/icons/document.svg"
                alt="Uploaded Document"
                width={16}
                height={16}
              />
            ) : (
              <Upload className="h-6 w-6" />
            )}
            <div className="flex flex-col flex-1">
              <p className="text-sm font-medium text-foreground">
                {uploadedFile
                  ? uploadedFile.name
                  : sourceFileName || "Selecione um arquivo PDF"}
              </p>
              {uploadedFile && (
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
          </div>
          {(uploadedFile || sourceFileName) && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRemoveFile();
              }}
              className="h-10 w-10 ml-4 hover:-translate-y-1"
            >
              <Image
                src="/icons/trash.svg"
                alt="Remove File"
                width={16}
                height={16}
              />
            </Button>
          )}
        </Button>
      </section>

      <section className="space-y-2">
        <Label htmlFor="mindcard-prompt" className="text-base font-bold">
          Prompt personalizado
        </Label>
        <Textarea
          id="mindcard-prompt"
          placeholder="Defina instruções personalizadas para a geração de cards"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          className="input-border min-h-[144px] resize-none rounded-2xl p-4 text-base"
        />
      </section>

      <Button
        type="button"
        onClick={handleGenerateCards}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-full text-base font-bold text-foreground secondary-border"
        size="xl"
      >
        <Image
          src="/icons/refresh.svg"
          alt="Refresh icon"
          width={16}
          height={16}
        />
        {loading
          ? "Criando..."
          : isCreationMode
          ? "Criar Mindcard"
          : "Gerar novos cards"}
      </Button>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Cards</h2>
        </div>
        {loadingCards ? (
          <div className="flex items-center justify-center rounded-2xl input-border bg-background px-5 py-8">
            <p className="text-sm text-muted-foreground">Carregando cards...</p>
          </div>
        ) : cards && cards.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event: DragEndEvent) => {
              const { active, over } = event;
              if (!over || active.id === over.id) return;
              setCards((prev) => {
                if (!prev) return prev;
                const oldIndex = prev.findIndex(
                  (c) => c.id === String(active.id)
                );
                const newIndex = prev.findIndex(
                  (c) => c.id === String(over.id)
                );
                if (oldIndex === -1 || newIndex === -1) return prev;
                return arrayMove(prev, oldIndex, newIndex);
              });
            }}
          >
            <SortableContext
              items={cards.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-4">
                {cards.map((card) => (
                  <SortableCardItem key={card.id} card={card} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Nenhum card disponível, faça upload de uma fonte e gere os cards.
          </p>
        )}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pt-16">
        <div className="pointer-events-auto mx-auto w-full max-w-md px-4 sm:px-6">
          <Button
            className={cn(
              "w-full rounded-full text-base font-bold",
              !isCreationMode && "bg-primary primary-border"
            )}
            size="lg"
            disabled={isCreationMode}
            onClick={() => router.push(`/practice/${mindcardSlug}/play`)}
          >
            Praticar
          </Button>
        </div>
      </div>
    </div>
  );
}
