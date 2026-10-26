"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { text, writeResult, type ActionResult } from "@/lib/formData";

// RLS only lets a caretaker write places of their own patients.
export async function addPlace(
  patientId: string,
  lat: number,
  lng: number,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("caretaker");
  const name = text(formData, "name");
  if (!name) return { error: "Please give the place a name." };
  if (!Number.isFinite(lat) || Math.abs(lat) > 90 || !Number.isFinite(lng)) return { error: "That spot is off the map." };

  // The map wraps around the world, so bring the longitude back into range.
  const wrappedLng = ((((lng + 180) % 360) + 360) % 360) - 180;

  const supabase = await createClient();
  const result = writeResult(
    await supabase
      .from("places")
      .insert({ patient_id: patientId, name, description: text(formData, "description"), lat, lng: wrappedLng })
      .select("id"),
  );
  if (result) return result;
  revalidatePath("/", "layout");
}

export async function deletePlace(id: number): Promise<ActionResult> {
  await requireRole("caretaker");
  const supabase = await createClient();
  const result = writeResult(await supabase.from("places").delete().eq("id", id).select("id"));
  if (result) return result;
  revalidatePath("/", "layout");
}
