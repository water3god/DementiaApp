"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/auth";
import { getPatientRow } from "@/lib/data/patients";
import { adminConfigError, createAdminClient } from "@/lib/supabase/admin";
import { text, type ActionResult } from "@/lib/formData";
import { MIN_PASSWORD_LENGTH, usernameToEmail } from "@/lib/patientLogin";
import { readPhoto, removePatientPhotos, removePhotos, savePhoto } from "@/lib/photos";
import { usernameBase } from "@/lib/usernames";

// Creating, editing and deleting patients needs the admin API (patients get
// their own login), so these run with the secret key. Each one first confirms
// through RLS that the signed-in caretaker manages the patient.

function readFields(formData: FormData) {
  return {
    name: text(formData, "name"),
    password: String(formData.get("password") ?? ""),
    photo: readPhoto(formData),
  };
}

function validate({ name, password, photo }: ReturnType<typeof readFields>, passwordRequired: boolean): ActionResult {
  if (!name) return { error: "Please enter the patient's name." };
  // The username is built from the name, so it needs at least one letter or digit.
  if (!usernameBase(name)) return { error: "Please enter a name with at least one letter or number." };
  if ((passwordRequired || password) && password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use a password of at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (photo && "error" in photo) return photo;
}

// base, base2, base3, … skipping any already taken.
function firstFree(base: string, taken: Set<string>) {
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) {
    if (!taken.has(`${base}${n}`)) return `${base}${n}`;
  }
}

// Creates the login and profile, or reports that the username was taken in
// the meantime (or belongs to a login with no profile) so the caller can retry.
async function createLogin(
  admin: SupabaseClient,
  caretakerId: string,
  username: string,
  { id, name, password, photoPath }: { id: string; name: string; password: string; photoPath: string },
): Promise<ActionResult | "taken"> {
  const { error } = await admin.auth.admin.createUser({
    id,
    email: usernameToEmail(username),
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (error) return error.code === "email_exists" ? "taken" : { error: error.message };

  const { error: profileError } = await admin
    .from("profiles")
    .insert({ id, role: "patient", name, username, caretaker_id: caretakerId, photo_path: photoPath });
  if (profileError) {
    // Don't leave a login behind that has no profile.
    await admin.auth.admin.deleteUser(id);
    return profileError.code === "23505" ? "taken" : { error: profileError.message };
  }
}

// The username is generated from the name, so the caretaker only picks a password.
export async function createPatient(formData: FormData): Promise<ActionResult> {
  const caretaker = await requireRole("caretaker");
  const fields = readFields(formData);
  const invalid = validate(fields, true) ?? adminConfigError();
  if (invalid) return invalid;

  const admin = createAdminClient();
  const base = usernameBase(fields.name);
  // Generated usernames only use a-z and 0-9, neither of which are LIKE wildcards.
  const { data: existing, error } = await admin
    .from("profiles")
    .select("username")
    .like("username", `${base}%`);
  if (error) return { error: error.message };
  const taken = new Set(existing.map((row) => row.username as string));

  // The id is picked here so the photo can go into the patient's folder first.
  const id = crypto.randomUUID();
  const saved = await savePhoto(admin, id, fields.photo);
  if ("error" in saved) return saved;
  const photoPath = saved.path ?? "";

  for (let attempt = 0; attempt < 5; attempt++) {
    const username = firstFree(base, taken);
    const result = await createLogin(admin, caretaker.id, username, { ...fields, id, photoPath });
    if (result !== "taken") {
      if (result) await removePhotos(admin, [photoPath]);
      else revalidatePath("/", "layout");
      return result;
    }
    taken.add(username);
  }
  await removePhotos(admin, [photoPath]);
  return { error: "Couldn't create a username. Please try again." };
}

// The username stays fixed so the patient's login never changes under them.
export async function updatePatient(id: string, formData: FormData): Promise<ActionResult> {
  const caretaker = await requireRole("caretaker");
  const patient = await getPatientRow(caretaker.id, id);
  if (!patient) return { error: "That patient no longer exists. Refresh the page." };

  const fields = readFields(formData);
  const invalid = validate(fields, false) ?? adminConfigError();
  if (invalid) return invalid;

  const admin = createAdminClient();
  const saved = await savePhoto(admin, id, fields.photo);
  if ("error" in saved) return saved;
  const photoPath = saved.path;
  const fail = async (message: string) => {
    if (photoPath) await removePhotos(admin, [photoPath]);
    return { error: message };
  };

  const { error } = await admin.auth.admin.updateUserById(id, {
    user_metadata: { name: fields.name },
    ...(fields.password && { password: fields.password }),
  });
  if (error) return fail(error.message);

  const { error: profileError } = await admin
    .from("profiles")
    .update({ name: fields.name, ...(photoPath !== undefined && { photo_path: photoPath }) })
    .eq("id", id);
  if (profileError) return fail(profileError.message);

  if (photoPath !== undefined) await removePhotos(admin, [patient.photo_path]);
  revalidatePath("/", "layout");
}

// Deleting the login cascades to the profile and all of the patient's
// contacts, tasks and places; their photos are removed separately.
export async function deletePatient(id: string): Promise<ActionResult> {
  const caretaker = await requireRole("caretaker");
  const patient = await getPatientRow(caretaker.id, id);
  if (!patient) return { error: "That patient no longer exists. Refresh the page." };
  const configError = adminConfigError();
  if (configError) return configError;

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { error: error.message };
  await removePatientPhotos(admin, id);
  revalidatePath("/", "layout");
}
