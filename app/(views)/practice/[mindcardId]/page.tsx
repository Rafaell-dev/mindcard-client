"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/app/components/ui/toggle-group";
import { cn } from "@/app/lib/utils";
import Image from "next/image";
import { Check } from "lucide-react";
import { toast } from "sonner";

// Hooks
import { useMindcard } from "./hooks/useMindcard";
import { useEditableTitle } from "./hooks/useEditableTitle";
import { useFileUpload } from "./hooks/useFileUpload";

// Components
import { MindcardHeader } from "./components/MindcardHeader";
import { FileUploadSection } from "./components/FileUploadSection";
import { PageRangeSection } from "./components/PageRangeSection";
import { CardsSection } from "./components/CardsSection";
import { SaveTitleModal } from "./components/SaveTitleModal";

type MindcardPageProps = {
  params: Promise<{
    mindcardId: string;
  }>;
};

/**
 * Página principal para gerenciar mindcards
 * Responsabilidade: orquestrar hooks e componentes
 */
export default function MindcardPage({ params }: MindcardPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const mindcardId = resolvedParams.mindcardId;

  // TODO: Get from auth context
  const userId = "ff9ff165-557f-427f-8c5b-aa1e52453003";

  // State
  const [prompt, setPrompt] = useState("");
  const [selectedCardTypes, setSelectedCardTypes] = useState<string[]>([
    // "ABERTA",
    "ALTERNATIVA",
    "MULTIPLA_ESCOLHA",
  ]);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [pageRangeError, setPageRangeError] = useState<string | null>(null);

  // Custom hooks
  const {
    title,
    cards,
    loadingCards,
    loading,
    isCreationMode,
    sourceFileName,
    initialPrompt,
    setCards,
    createNewMindcard,
    updateTitle,
  } = useMindcard({ mindcardId, userId });

  // Initialize prompt from mindcard data
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const {
    isEditing,
    editedTitle,
    titleInputRef,
    cancelButtonRef,
    showSaveModal,
    setShowSaveModal,
    setEditedTitle,
    startEdit,
    cancelEdit,
    saveEdit,
  } = useEditableTitle({
    initialTitle: title,
    onSave: updateTitle,
    isCreationMode,
  });

  const {
    uploadedFile,
    sourceFileName: uploadSourceFileName,
    totalPages,
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    openFilePicker,
  } = useFileUpload();

  // Reset page range when file changes
  useEffect(() => {
    if (totalPages) {
      setStartPage(1);
      setEndPage(totalPages);
      setPageRangeError(null);
    }
  }, [totalPages]);

  // Validate page range
  const validatePageRange = (start: number, end: number): string | null => {
    if (start < 1) {
      return "A página inicial não pode ser menor que 1.";
    }
    if (totalPages && end > totalPages) {
      return `A página final não pode ultrapassar ${totalPages}.`;
    }
    if (end < start) {
      return "A página final não pode ser menor que a página inicial.";
    }
    return null;
  };

  const handleStartPageChange = (value: number) => {
    setStartPage(value);
    const error = validatePageRange(value, endPage);
    setPageRangeError(error);
  };

  const handleEndPageChange = (value: number) => {
    setEndPage(value);
    const error = validatePageRange(startPage, value);
    setPageRangeError(error);
  };

  // Use uploaded file name or existing source file name
  const displaySourceFileName = uploadedFile
    ? null
    : uploadSourceFileName || sourceFileName;

  // Handle card type changes from ToggleGroup
  const handleCardTypeChange = (value: string[]) => {
    // Don't allow empty selection
    if (value.length > 0) {
      setSelectedCardTypes(value);
    }
  };

  // Handlers
  const handleBack = () => {
    router.push("/mindcards");
  };

  const handleGenerateCards = async () => {
    if (isCreationMode) {
      if (!uploadedFile) {
        toast.error("Por favor, selecione um arquivo.");
        return;
      }
      await createNewMindcard(
        uploadedFile,
        prompt,
        selectedCardTypes as ("ABERTA" | "ALTERNATIVA" | "MULTIPLA_ESCOLHA")[]
      );
    }
    // Update mode would generate new cards (not implemented yet)
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const trimmedTitle = editedTitle.trim();

      if (!trimmedTitle) {
        toast.error("O título não pode ficar em branco");
        setEditedTitle(title);
        return;
      }

      if (trimmedTitle !== title) {
        setShowSaveModal(true);
      } else {
        cancelEdit();
      }
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const mindcardSlug = mindcardId ?? "Mindcard";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <MindcardHeader
        title={title}
        isEditing={isEditing}
        editedTitle={editedTitle}
        isCreationMode={isCreationMode}
        titleInputRef={titleInputRef}
        cancelButtonRef={cancelButtonRef}
        onBack={handleBack}
        onTitleEdit={startEdit}
        onTitleChange={setEditedTitle}
        onCancelEdit={cancelEdit}
        onKeyDown={handleTitleKeyDown}
      />

      <FileUploadSection
        uploadedFile={uploadedFile}
        sourceFileName={displaySourceFileName}
        fileInputRef={fileInputRef}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
        onFilePicker={openFilePicker}
      />

      <PageRangeSection
        startPage={startPage}
        endPage={endPage}
        totalPages={totalPages}
        onStartPageChange={handleStartPageChange}
        onEndPageChange={handleEndPageChange}
        error={pageRangeError}
      />

      <section className="space-y-2">
        <Label className="text-base font-bold">Tipo de questões</Label>
        <ToggleGroup
          type="multiple"
          value={selectedCardTypes}
          onValueChange={handleCardTypeChange}
          spacing={12}
          className="grid w-full grid-cols-2 gap-3"
        >
          {[
            // { type: "ABERTA", label: "Aberta" },
            { type: "ALTERNATIVA", label: "Alternativa" },
            { type: "MULTIPLA_ESCOLHA", label: "Múltipla Escolha" },
          ].map(({ type, label }) => (
            <ToggleGroupItem
              key={type}
              value={type}
              aria-label={`Selecionar ${label}`}
              className={cn(
                "w-full cursor-pointer rounded-full px-5 py-3 text-sm font-medium transition-all h-14",
                selectedCardTypes.includes(type)
                  ? "input-border bg-background"
                  : "border border-2 border-dashed bg-background"
              )}
            >
              <span className="flex items-center justify-center gap-2">
                {selectedCardTypes.includes(type) && (
                  <Check className="h-4 w-4" />
                )}
                {label}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </section>

      {/* <section className="space-y-2">
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
      </section> */}

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

      <CardsSection
        cards={cards}
        loadingCards={loadingCards}
        onCardsReorder={setCards}
      />

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

      <SaveTitleModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={saveEdit}
        onCancel={() => {
          setShowSaveModal(false);
          cancelEdit();
        }}
        loading={loading}
      />
    </div>
  );
}
