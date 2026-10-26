"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { text, writeResult, type ActionResult } from "@/lib/formData";

// Patients and caretakers can both tick tasks: a completion is its own row,
// allowed for anyone who can see the task.
export async function setTaskCompleted(id: number, completed: boolean) {
  const supabase = await createClient();
  const { error } = completed
    ? await supabase
        .from("task_completions")
        .upsert({ task_id: id }, { onConflict: "task_id", ignoreDuplicates: true })
    : await supabase.from("task_completions").delete().eq("task_id", id);
  if (error) throw error;
  revalidatePath("/", "layout");
}

// RLS only lets a caretaker write tasks of their own patients.
export async function saveTask(
  patientId: string,
  id: number | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("caretaker");
  const taskText = text(formData, "text");
  if (!taskText) return { error: "Please describe the task." };

  const supabase = await createClient();
  const result = id
    ? writeResult(await supabase.from("tasks").update({ text: taskText }).eq("id", id).select("id"))
    : writeResult(await supabase.from("tasks").insert({ text: taskText, patient_id: patientId }).select("id"));
  if (result) return result;
  revalidatePath("/", "layout");
}

export async function deleteTask(id: number): Promise<ActionResult> {
  await requireRole("caretaker");
  const supabase = await createClient();
  const result = writeResult(await supabase.from("tasks").delete().eq("id", id).select("id"));
  if (result) return result;
  revalidatePath("/", "layout");
}
