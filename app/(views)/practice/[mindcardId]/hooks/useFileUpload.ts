"use client";

import { useRef, type ChangeEvent } from "react";
import { useState } from "react";

interface UseFileUploadReturn {
  uploadedFile: File | null;
  sourceFileName: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  openFilePicker: () => void;
  setSourceFileName: (filename: string | null) => void;
}

/**
 * Hook para gerenciar upload de arquivo
 * Responsabilidade: gerenciar estado e operações de upload
 */
export function useFileUpload(): UseFileUploadReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceFileName, setSourceFileName] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSourceFileName(null); // Clear source filename when uploading new file
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setSourceFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return {
    uploadedFile,
    sourceFileName,
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    openFilePicker,
    setSourceFileName,
  };
}
