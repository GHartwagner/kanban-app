"use client";

import Column, { type CardItem } from "./Column";

export type ColumnData = {
  title: string;
  cards: CardItem[];
};

export default function Board({
  columns,
  onMoveCard,
}: {
  columns: ColumnData[];
  onMoveCard: (cardId: string, sourceColumn: string, targetColumn: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {columns.map((column) => (
        <Column
          key={column.title}
          title={column.title}
          cards={column.cards}
          onMoveCard={onMoveCard}
        />
      ))}
    </div>
  );
}
