"use client";

import { useState } from "react";
import Card from "./Card";

export type CardItem = { id: string; text: string };

export default function Column({
  title,
  cards,
  onMoveCard,
}: {
  title: string;
  cards: CardItem[];
  onMoveCard: (cardId: string, sourceColumn: string, targetColumn: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/source-column", title);
  };

  const handleDragEnd = () => {
    setDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const cardId = e.dataTransfer.getData("text/plain");
    if (!cardId) return;
    const sourceColumn = e.dataTransfer.getData("application/source-column");
    if (sourceColumn === title) return;
    onMoveCard(cardId, sourceColumn, title);
  };

  return (
    <section
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900 ${
        dragOver ? "border-zinc-400 bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800" : ""
      }`}
    >
      <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      <ul className="flex flex-col gap-3">
        {cards.map((card) => (
          <Card key={card.id} id={card.id}>
            {card.text}
          </Card>
        ))}
      </ul>
    </section>
  );
}
