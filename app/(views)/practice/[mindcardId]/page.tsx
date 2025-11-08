"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type MindcardPageProps = {
  params: Promise<{
    mindcardId: string;
  }>;
};

type MindcardCard = {
  id: string;
  title: string;
};

const createInitialCards = () =>
  Array.from({ length: 8 }, (_, index) => ({
    id: `${index + 1}`,
    title: `${String(index + 1).padStart(2, "0")} Card`,
  }));

const generateCardId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export default function MindcardPage({ params }: MindcardPageProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [cards, setCards] = useState<MindcardCard[]>(createInitialCards);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const SortableCardItem: React.FC<{ card: MindcardCard }> = ({ card }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: card.id });

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
          <Image src="/icons/question_card.svg" alt="Card Question" width={20} height={20} />
        </span>
        <Label className="flex-1 text-sm font-bold text-foreground">
          {card.title}
        </Label>
        <Image src="/icons/menu2.svg" alt="Grip Vertical" width={16} height={16} />
      </li>
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerateCards = () => {
    setCards(
      createInitialCards().map((card) => ({
        ...card,
        id: generateCardId(),
      }))
    );
  };

  const handleBack = () => {
    router.push("/mindcards");
  };

  const handleFilePicker = () => {
    fileInputRef.current?.click();
  };

  const { mindcardId } = React.use(params);
  const mindcardSlug = mindcardId ?? "Mindcard";
  const mindcardTitle = decodeURIComponent(mindcardSlug).replace(/-/g, " ");

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="h-10 w-10 rounded-full"
        >
          <Image src="/icons/arrow_left.svg" alt="Back" width={10} height={10} />
        </Button>
        <h1 className="text-2xl font-bold capitalize">
          {mindcardTitle.replace(/-/g, " ")}
        </h1>
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
            {uploadedFile ? <Image src="/icons/document.svg" alt="Uploaded Document" width={16} height={16} /> : <Upload className="h-6 w-6" />}
            <p className="text-sm font-medium text-foreground">
              {uploadedFile ? uploadedFile.name : "Selecione um arquivo PDF"}
            </p>
            {uploadedFile && (
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
          {uploadedFile && (
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
              <Image src="/icons/trash.svg" alt="Remove File" width={16} height={16} />
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
        className="flex w-full items-center justify-center gap-2 rounded-full text-base font-bold text-foreground secondary-border"
        size="xl"
      >
        <Image src="/icons/refresh.svg" alt="Refresh icon" width={16} height={16} />
        Gerar novos cards
      </Button>

      <section className="space-y-3">
        <div className="space-y-1">
          <h2 className="text-lg font-bold">Cards</h2>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event: DragEndEvent) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;
            setCards((prev) => {
              const oldIndex = prev.findIndex((c) => c.id === String(active.id));
              const newIndex = prev.findIndex((c) => c.id === String(over.id));
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
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/95 to-transparent pb-6 pt-16">
        <div className="pointer-events-auto mx-auto w-full max-w-md px-4 sm:px-6">
          <Button
            className="w-full rounded-full bg-primary text-base font-bold primary-border"
            size="lg"
            onClick={() => router.push(`/practice/${mindcardSlug}/play`)}
          >
            Praticar
          </Button>
        </div>
      </div>
    </div>
  );
}
