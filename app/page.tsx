import KanbanBoardClient from "@/components/KanbanBoardClient";
import AppHeader from "@/components/AppHeader";
import type { ColumnData } from "@/components/Board";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const STATUS_COLUMNS = [
  { key: "todo", title: "To Do" },
  { key: "doing", title: "Doing" },
  { key: "done", title: "Done" },
] as const;

export async function createCardAction() {
  "use server";

  const buildErrorRedirect = (message: string): never => {
    const params = new URLSearchParams({ insertError: message });
    redirect(`/?${params.toString()}`);
  };

  const supabase = getSupabaseAdmin();

  if (!supabase) {
    buildErrorRedirect(
      "Supabase-Konfiguration fehlt (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  const supabaseClient = supabase!;

  const { data: maxRows, error: maxError } = await supabaseClient
    .from("cards")
    .select("position")
    .eq("status", "todo")
    .order("position", { ascending: false })
    .limit(1);

  if (maxError) {
    buildErrorRedirect(
      "Konnte die nächste Position für neue Karten nicht ermitteln."
    );
  }

  const maxPosition = maxRows?.[0]?.position ?? 0;
  const nextPosition = maxPosition + 1;

  const { error: insertError } = await supabaseClient.from("cards").insert({
    title: "Neue Aufgabe",
    status: "todo",
    position: nextPosition,
  });

  if (insertError) {
    buildErrorRedirect("Die neue Karte konnte nicht angelegt werden.");
  }

  revalidatePath("/");
  redirect("/");
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const insertErrorParam = resolvedSearchParams?.["insertError"];
  const insertError =
    typeof insertErrorParam === "string" ? insertErrorParam : null;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <AppHeader>
        <form action={createCardAction}>
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-50 shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + Neue Karte
          </button>
        </form>
      </AppHeader>
      <main className="mx-auto max-w-7xl p-4 md:p-6">
        {insertError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-200">
            {insertError}
          </div>
        )}
        <KanbanBoardClient initialColumns={columns} />
      </main>
    </div>
  );
}
