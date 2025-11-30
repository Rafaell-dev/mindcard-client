"use client";

import { useEffect, useRef, useState } from "react";

interface UseEditableTitleProps {
  initialTitle: string;
  onSave: (newTitle: string) => Promise<void>;
  isCreationMode: boolean;
}

interface UseEditableTitleReturn {
  isEditing: boolean;
  editedTitle: string;
  titleInputRef: React.RefObject<HTMLInputElement>;
  cancelButtonRef: React.RefObject<HTMLButtonElement>;
  showSaveModal: boolean;
  setShowSaveModal: (show: boolean) => void;
  setEditedTitle: (title: string) => void;
  startEdit: () => void;
  cancelEdit: () => void;
  saveEdit: () => Promise<void>;
}

/**
 * Hook para gerenciar título editável
 * Responsabilidade: gerenciar estado de edição, validação e persistência
 */
export function useEditableTitle({
  initialTitle,
  onSave,
  isCreationMode,
}: UseEditableTitleProps): UseEditableTitleReturn {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [showSaveModal, setShowSaveModal] = useState(false);

  const startEdit = () => {
    if (isCreationMode) return;
    setOriginalTitle(initialTitle);
    setEditedTitle(initialTitle);
    setIsEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const cancelEdit = () => {
    setEditedTitle(originalTitle);
    setIsEditing(false);
  };

  const saveEdit = async () => {
    setShowSaveModal(false);
    await onSave(editedTitle);
    setIsEditing(false);
  };

  // Handle click outside detection
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      const isClickOutside =
        titleInputRef.current &&
        !titleInputRef.current.contains(target) &&
        cancelButtonRef.current &&
        !cancelButtonRef.current.contains(target);

      if (isClickOutside) {
        if (editedTitle !== originalTitle) {
          setShowSaveModal(true);
        } else {
          setIsEditing(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editedTitle, originalTitle]);

  return {
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
  };
}
