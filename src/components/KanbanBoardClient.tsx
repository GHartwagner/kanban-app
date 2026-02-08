"use client";

import { useState, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import Board from "@/components/Board";
import type { ColumnData } from "@/components/Board";

export default function KanbanBoardClient({
  initialColumns,
}: {
  initialColumns: ColumnData[];
}) {
  const [columns, setColumns] = useState<ColumnData[]>(initialColumns);

  const handleMoveCard = useCallback(
    (cardId: string, sourceColumnTitle: string, targetColumnTitle: string) => {
      setColumns((prev) => {
        const sourceCol = prev.find((c) => c.title === sourceColumnTitle);
        const card = sourceCol?.cards.find((c) => c.id === cardId);
        if (!card) return prev;
        return prev.map((col) => {
          if (col.title === sourceColumnTitle) {
            return { ...col, cards: col.cards.filter((c) => c.id !== cardId) };
          }
          if (col.title === targetColumnTitle) {
            return { ...col, cards: [...col.cards, card] };
          }
          return col;
        });
      });
    },
    []
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader />
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <Board columns={columns} onMoveCard={handleMoveCard} />
      </main>
    </div>
  );
}
