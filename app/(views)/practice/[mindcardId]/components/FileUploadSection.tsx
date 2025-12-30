"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Upload } from "lucide-react";

interface FileUploadSectionProps {
  uploadedFile: File | null;
  sourceFileName: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  onFilePicker: () => void;
}

/**
 * Componente para seção de upload de arquivo
 * Responsabilidade: renderizar interface de upload/remoção de arquivo
 */
export function FileUploadSection({
  uploadedFile,
  sourceFileName,
  fileInputRef,
  onFileChange,
  onRemoveFile,
  onFilePicker,
}: FileUploadSectionProps) {
  const hasFile = uploadedFile || sourceFileName;
  const displayName = uploadedFile
    ? uploadedFile.name
    : sourceFileName || "Selecione um arquivo PDF";

  return (
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
        onChange={onFileChange}
      />
      <div
        className="flex justify-between gap-3 rounded-2xl input-border bg-white h-14 px-4 py-3 w-full cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onFilePicker}
      >
        <div className="flex flex-1 items-center gap-3">
          {hasFile ? (
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
            <p className="text-sm font-medium text-foreground">{displayName}</p>
            {uploadedFile && (
              <p className="text-xs text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
