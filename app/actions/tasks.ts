"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setTaskCompleted(id: number, completed: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ completed }).eq("id", id);
  if (error) throw error;
  revalidatePath("/home");
  revalidatePath("/Todo");
}
