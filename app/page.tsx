"use client";

import { useState, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import Board from "@/components/Board";
import type { ColumnData } from "@/components/Board";

const INITIAL_COLUMNS: ColumnData[] = [
  {
    title: "To Do",
    cards: [
      { id: "todo-1", text: "Aufgabe recherchieren" },
      { id: "todo-2", text: "Konzept erstellen" },
      { id: "todo-3", text: "Review einplanen" },
    ],
  },
  {
    title: "Doing",
    cards: [
      { id: "doing-1", text: "UI-Komponenten bauen" },
      { id: "doing-2", text: "API anbinden" },
    ],
  },
  {
    title: "Done",
    cards: [
      { id: "done-1", text: "Projekt aufsetzen" },
      { id: "done-2", text: "Design-System festlegen" },
      { id: "done-3", text: "Erste Tests schreiben" },
    ],
  },
];

export default function Home() {
  const [columns, setColumns] = useState<ColumnData[]>(INITIAL_COLUMNS);

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
