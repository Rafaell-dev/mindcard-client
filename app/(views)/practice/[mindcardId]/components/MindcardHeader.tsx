"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { Pencil, X } from "lucide-react";

interface MindcardHeaderProps {
  title: string;
  isEditing: boolean;
  editedTitle: string;
  isCreationMode: boolean;
  titleInputRef: React.RefObject<HTMLInputElement>;
  cancelButtonRef: React.RefObject<HTMLButtonElement>;
  onBack: () => void;
  onTitleEdit: () => void;
  onTitleChange: (value: string) => void;
  onCancelEdit: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Componente para header com título editável
 * Responsabilidade: renderizar header e controles de edição do título
 */
export function MindcardHeader({
  title,
  isEditing,
  editedTitle,
  isCreationMode,
  titleInputRef,
  cancelButtonRef,
  onBack,
  onTitleEdit,
  onTitleChange,
  onCancelEdit,
  onKeyDown,
}: MindcardHeaderProps) {
  return (
    <header className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={onBack}
        className="h-10 w-10 rounded-full"
      >
        <Image src="/icons/arrow_left.svg" alt="Back" width={10} height={10} />
      </Button>

      {isEditing ? (
        <div className="flex items-center gap-2 flex-1">
          <label className="w-full group flex h-14 items-center gap-3 rounded-lg input-border bg-background px-5">
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full text-2xl font-bold h-auto py-1 px-2 rounded-lg"
              onKeyDown={onKeyDown}
            />
          </label>
          <Button
            ref={cancelButtonRef}
            variant="ghost"
            size="icon"
            onClick={onCancelEdit}
            className="h-8 w-8 rounded-full hover:bg-destructive/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 flex-1 cursor-pointer group"
          onClick={onTitleEdit}
        >
          <h1 className="text-2xl font-bold capitalize">{title}</h1>
          {!isCreationMode && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Pencil className="h-6 w-6 text-muted-foreground" />
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
