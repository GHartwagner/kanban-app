import type { PropsWithChildren } from "react";

export default function AppHeader({ children }: PropsWithChildren) {
  return (
    <header className="border-b border-zinc-200 bg-white px-6 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Kanban
        </h1>
        {children}
      </div>
    </header>
  );
}
