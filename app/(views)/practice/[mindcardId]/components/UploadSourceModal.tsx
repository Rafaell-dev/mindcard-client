"use client";

import { useRef, type ChangeEvent } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Upload, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface UploadSourceModalProps {
  isOpen: boolean;
  uploadedFile: File | null;
  isUploading?: boolean;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
}

type UploadState = "pending" | "uploading" | "complete";

/**
 * Modal para upload obrigatório de fonte ao criar um novo mindcard
 * Exibido automaticamente no modo de criação
 */
export function UploadSourceModal({
  isOpen,
  uploadedFile,
  isUploading = false,
  onFileChange,
  onCancel,
}: UploadSourceModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadState: UploadState = isUploading
    ? "uploading"
    : uploadedFile
    ? "complete"
    : "pending";

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  const stateConfig = {
    pending: {
      icon: <Upload className="h-8 w-8 text-muted-foreground" />,
      title: "Selecione um arquivo",
      description: "Clique para fazer upload de um PDF",
      borderClass: "border-dashed border-2 border-muted-foreground/30",
    },
    uploading: {
      icon: <Loader2 className="h-8 w-8 text-primary animate-spin" />,
      title: "Enviando...",
      description: "Aguarde enquanto processamos o arquivo",
      borderClass: "border-dashed border-2 border-primary/50",
    },
    complete: {
      icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
      title: uploadedFile?.name || "Arquivo enviado",
      description: uploadedFile
        ? `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`
        : "Pronto para continuar",
      borderClass: "input-border",
    },
  };

  const config = stateConfig[uploadState];

  return (
    <>
      {/* Custom backdrop with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      <Dialog open={isOpen} modal={false}>
        <DialogContent
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
          className="animate-in zoom-in-95 duration-300 ease-out sm:max-w-md z-50"
        >
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">
              Comece enviando sua fonte
            </DialogTitle>
            <DialogDescription className="text-base">
              Para gerar seus mindcards, precisamos do material de estudo. Faça
              upload de um arquivo PDF para continuar.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={onFileChange}
            />

            <div
              onClick={handleOpenFilePicker}
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-2xl p-8 cursor-pointer transition-all hover:bg-muted/50",
                config.borderClass
              )}
            >
              <div className="rounded-full bg-muted p-4">
                {uploadState === "complete" ? (
                  <FileText className="h-8 w-8 text-primary" />
                ) : (
                  config.icon
                )}
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">{config.title}</p>
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
              </div>
              {uploadState === "complete" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Upload concluído</span>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full rounded-full input-border text-base font-bold"
            size="lg"
          >
            Cancelar
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
