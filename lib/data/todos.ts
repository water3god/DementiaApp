import { createClient } from "@/lib/supabase/server";

export type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type TaskRow = {
  id: number;
  text: string;
  // One-to-one embed (task_completions.task_id is its primary key): a row or null.
  task_completions: { task_id: number } | null;
};

// RLS limits reads to the patient themselves and their caretaker.
export async function getTasks(patientId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("id, text, task_completions(task_id)")
    .eq("patient_id", patientId)
    .order("id");
  if (error) throw error;
  return (data as unknown as TaskRow[]).map((row) => ({
    id: row.id,
    text: row.text,
    completed: row.task_completions !== null,
  }));
}
