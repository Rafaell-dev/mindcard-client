"use client";

import React from "react";
// Sortable imports - comentado temporariamente
// import {
//   DndContext,
//   closestCenter,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
// } from "@dnd-kit/core";
// import {
//   SortableContext,
//   arrayMove,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";
import type { MindcardItem } from "@/app/api/v1/mindcard-item/types";
// import { SortableCardItem } from "./SortableCardItem";
import Image from "next/image";
import { Label } from "@/app/components/ui/label";

interface CardsSectionProps {
  cards: MindcardItem[];
  loadingCards: boolean;
  onCardsReorder: (newCards: MindcardItem[]) => void;
}

/**
 * Componente para seção de cards
 * Responsabilidade: renderizar lista de cards
 * Nota: Funcionalidade de drag-and-drop temporariamente desativada
 */
export function CardsSection({
  cards,
  loadingCards,
  onCardsReorder,
}: CardsSectionProps) {
  // Sortable logic - comentado temporariamente
  // const sensors = useSensors(
  //   useSensor(PointerSensor, {
  //     activationConstraint: { distance: 5 },
  //   })
  // );

  // const handleDragEnd = (event: DragEndEvent) => {
  //   const { active, over } = event;
  //   if (!over || active.id === over.id) return;

  //   const oldIndex = cards.findIndex((c) => c.id === String(active.id));
  //   const newIndex = cards.findIndex((c) => c.id === String(over.id));

  //   if (oldIndex === -1 || newIndex === -1) return;

  //   const newCards = arrayMove(cards, oldIndex, newIndex);
  //   onCardsReorder(newCards);
  // };

  return (
    <section className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-lg font-bold">Cards</h2>
      </div>
      {loadingCards ? (
        <div className="flex items-center justify-center rounded-2xl input-border bg-background px-5 py-8">
          <p className="text-sm text-muted-foreground">Carregando cards...</p>
        </div>
      ) : cards && cards.length > 0 ? (
        <ul className="space-y-4">
          {cards.map((card) => (
            <li
              key={card.id}
              className="flex items-center gap-3 rounded-2xl input-border bg-background px-5 py-4 h-14"
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
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Nenhum card disponível, faça upload de uma fonte e gere os cards.
        </p>
      )}
    </section>
  );
}
