"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { contactGroups, type ContactGroup } from "@/lib/data/contactGroups";
import { text, writeResult, type ActionResult } from "@/lib/formData";
import { readPhoto, removePhotos, savePhoto } from "@/lib/photos";

function toRow(formData: FormData) {
  const name = text(formData, "name");
  return {
    name,
    full_name: text(formData, "fullName") || name,
    relationship: text(formData, "relationship"),
    contact_group: text(formData, "group") as ContactGroup,
    about: text(formData, "about"),
    schedule: text(formData, "schedule"),
    phone: text(formData, "phone"),
  };
}

function validate(row: ReturnType<typeof toRow>): ActionResult {
  if (!row.name) return { error: "Please enter a name." };
  if (!row.relationship) return { error: "Please enter how they are related." };
  if (!contactGroups.some((g) => g.id === row.contact_group)) return { error: "Please pick a group." };
}

// RLS only lets a caretaker write contacts, and photos, of their own patients.
export async function saveContact(
  patientId: string,
  id: number | undefined,
  formData: FormData,
): Promise<ActionResult> {
  await requireRole("caretaker");
  const row = toRow(formData);
  const photo = readPhoto(formData);
  const invalid = validate(row) ?? (photo && "error" in photo ? photo : undefined);
  if (invalid) return invalid;

  const supabase = await createClient();
  let oldPath = "";
  if (id) {
    const { data } = await supabase.from("contacts").select("photo_path").eq("id", id).maybeSingle();
    oldPath = data?.photo_path ?? "";
  }

  const saved = await savePhoto(supabase, patientId, photo);
  if ("error" in saved) return saved;
  const photoPath = saved.path;
  const values = photoPath === undefined ? row : { ...row, photo_path: photoPath };

  const result = id
    ? writeResult(await supabase.from("contacts").update(values).eq("id", id).select("id"))
    : writeResult(await supabase.from("contacts").insert({ ...values, patient_id: patientId }).select("id"));
  if (result) {
    if (photoPath) await removePhotos(supabase, [photoPath]);
    return result;
  }
  if (photoPath !== undefined) await removePhotos(supabase, [oldPath]);
  revalidatePath("/", "layout");
}

export async function deleteContact(id: number): Promise<ActionResult> {
  await requireRole("caretaker");
  const supabase = await createClient();
  const deleted = await supabase.from("contacts").delete().eq("id", id).select("id, photo_path");
  const result = writeResult(deleted);
  if (result) return result;
  await removePhotos(supabase, deleted.data!.map((row) => row.photo_path));
  revalidatePath("/", "layout");
}
