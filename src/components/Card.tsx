"use client";

export default function Card({ id, children }: { id: string; children: React.ReactNode }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };

  return (
    <li
      draggable
      onDragStart={handleDragStart}
      className="cursor-grab rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 shadow-sm active:cursor-grabbing dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
    >
      {children}
    </li>
  );
}
