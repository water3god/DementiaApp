import { createClient } from "@/lib/supabase/server";

export type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// RLS limits every query to the signed-in user's own rows.
export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("id, text, completed")
    .order("id");
  if (error) throw error;
  return data;
}
