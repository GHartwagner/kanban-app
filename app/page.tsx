const COLUMNS = [
  {
    title: "To Do",
    cards: [
      "Aufgabe recherchieren",
      "Konzept erstellen",
      "Review einplanen",
    ],
  },
  {
    title: "Doing",
    cards: [
      "UI-Komponenten bauen",
      "API anbinden",
    ],
  },
  {
    title: "Done",
    cards: [
      "Projekt aufsetzen",
      "Design-System festlegen",
      "Erste Tests schreiben",
    ],
  },
] as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Kanban
        </h1>
      </header>

      <main className="mx-auto max-w-7xl p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COLUMNS.map((column) => (
            <section
              key={column.title}
              className="flex flex-col rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {column.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {column.cards.map((text, i) => (
                  <li
                    key={`${column.title}-${i}`}
                    className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {text}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
