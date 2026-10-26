import type { PostgrestError } from "@supabase/supabase-js";

export type ActionResult = { error: string } | undefined;

export function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

// Updates and deletes that RLS hides return no error, just no rows; treat
// that as a failure so the caretaker isn't told a change was saved when it wasn't.
export function writeResult(
  { error, data }: { error: PostgrestError | null; data: unknown[] | null },
  notFound = "That item no longer exists. Refresh the page and try again.",
): ActionResult {
  if (error) return { error: error.message };
  if (!data?.length) return { error: notFound };
}
