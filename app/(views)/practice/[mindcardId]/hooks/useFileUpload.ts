"use client";

import { useRef, type ChangeEvent, useCallback } from "react";
import { useState } from "react";

interface UseFileUploadReturn {
  uploadedFile: File | null;
  sourceFileName: string | null;
  totalPages: number | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: () => void;
  openFilePicker: () => void;
  setSourceFileName: (filename: string | null) => void;
  setTotalPages: (pages: number | null) => void;
}

/**
 * Counts the number of pages in a PDF file by looking for /Count entries
 * This is a simple heuristic that works for most PDFs
 */
async function countPdfPages(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;

        // Look for /Count patterns in the PDF
        // This matches patterns like /Count 15 or /Count 123
        const countMatches = content.match(/\/Count\s+(\d+)/g);

        if (countMatches && countMatches.length > 0) {
          // Get the highest count value (usually the total pages)
          const counts = countMatches.map((match) => {
            const num = match.match(/\d+/);
            return num ? parseInt(num[0], 10) : 0;
          });
          resolve(Math.max(...counts));
        } else {
          // Fallback: count /Page objects (less accurate but works)
          const pageMatches = content.match(/\/Type\s*\/Page[^s]/g);
          resolve(pageMatches ? pageMatches.length : 1);
        }
      } catch {
        resolve(1); // Default to 1 page on error
      }
    };

    reader.onerror = () => resolve(1);

    // Read as text to search for patterns
    reader.readAsText(file);
  });
}

/**
 * Hook para gerenciar upload de arquivo
 * Responsabilidade: gerenciar estado e operações de upload
 */
export function useFileUpload(): UseFileUploadReturn {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceFileName, setSourceFileName] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number | null>(null);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setUploadedFile(file);
        setSourceFileName(null); // Clear source filename when uploading new file

        // Count PDF pages
        if (file.type === "application/pdf") {
          const pages = await countPdfPages(file);
          setTotalPages(pages);
        } else {
          setTotalPages(null);
        }
      }
    },
    []
  );

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setSourceFileName(null);
    setTotalPages(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    uploadedFile,
    sourceFileName,
    totalPages,
    fileInputRef,
    handleFileChange,
    handleRemoveFile,
    openFilePicker,
    setSourceFileName,
    setTotalPages,
  };
}
