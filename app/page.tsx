import KanbanBoardClient from "@/components/KanbanBoardClient";
import type { ColumnData } from "@/components/Board";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const STATUS_COLUMNS = [
  { key: "todo", title: "To Do" },
  { key: "doing", title: "Doing" },
  { key: "done", title: "Done" },
] as const;

export default async function Home() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-6 py-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          <p className="font-medium">ENV fehlt</p>
          <p className="mt-1 text-sm">
            SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen in .env.local gesetzt sein.
          </p>
        </div>
      </div>
    );
  }

  const { data: rows, error } = await supabase
    .from("cards")
    .select("id, title, status, position")
    .order("status")
    .order("position");

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
          <p className="font-medium">Fehler beim Laden</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  type CardRow = { id: string; title: string | null; status: string; position: number };
  const cards: CardRow[] = rows ?? [];
  const columns: ColumnData[] = STATUS_COLUMNS.map(({ key, title }) => ({
    title,
    cards: cards
      .filter((c) => c.status === key)
      .map((c) => ({ id: c.id, text: c.title ?? "" })),
  }));

  return <KanbanBoardClient initialColumns={columns} />;
}
