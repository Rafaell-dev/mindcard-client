"use client";

import React from "react";
import Image from "next/image";
import { Label } from "@/app/components/ui/label";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { MindcardItem } from "@/app/api/v1/mindcard-item/types";

interface SortableCardItemProps {
  card: MindcardItem;
}

/**
 * Componente para item de card sortable
 * Responsabilidade: renderizar um card individual com drag-and-drop
 */
export function SortableCardItem({ card }: SortableCardItemProps) {
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
}
