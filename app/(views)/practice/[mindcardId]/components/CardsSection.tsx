"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { MindcardItem } from "@/app/api/v1/mindcard-item/types";
import { SortableCardItem } from "./SortableCardItem";

interface CardsSectionProps {
  cards: MindcardItem[];
  loadingCards: boolean;
  onCardsReorder: (newCards: MindcardItem[]) => void;
}

/**
 * Componente para seção de cards
 * Responsabilidade: renderizar lista de cards com drag-and-drop
 */
export function CardsSection({
  cards,
  loadingCards,
  onCardsReorder,
}: CardsSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cards.findIndex((c) => c.id === String(active.id));
    const newIndex = cards.findIndex((c) => c.id === String(over.id));

    if (oldIndex === -1 || newIndex === -1) return;

    const newCards = arrayMove(cards, oldIndex, newIndex);
    onCardsReorder(newCards);
  };

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
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
      ) : (
        <p className="text-center text-sm text-muted-foreground">
          Nenhum card disponível, faça upload de uma fonte e gere os cards.
        </p>
      )}
    </section>
  );
}
