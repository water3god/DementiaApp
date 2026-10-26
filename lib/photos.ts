import type { SupabaseClient } from "@supabase/supabase-js";

// Must match the photos bucket in supabase/schema.sql.
const BUCKET = "photos";
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
export const PHOTO_TYPES = Object.keys(EXTENSIONS);
export const MAX_PHOTO_MB = 5;
const SIGNED_URL_SECONDS = 60 * 60;

type PhotoChange = { file: File } | { remove: true } | { error: string } | undefined;

// Reads the photo field and the "remove photo" flag that PhotoField submits.
export function readPhoto(formData: FormData): PhotoChange {
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    if (!EXTENSIONS[file.type]) return { error: "Please choose a JPEG, PNG, WebP or GIF photo." };
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) return { error: `Please choose a photo under ${MAX_PHOTO_MB} MB.` };
    return { file };
  }
  if (formData.get("removePhoto")) return { remove: true };
}

// The photo_path to save: a new upload, "" to clear it, or undefined to keep
// the current one. Uploads go under the patient's folder, which storage RLS checks.
export async function savePhoto(
  client: SupabaseClient,
  patientId: string,
  photo: PhotoChange,
): Promise<{ path?: string } | { error: string }> {
  if (!photo || "error" in photo) return {};
  if ("remove" in photo) return { path: "" };

  const { file } = photo;
  const path = `${patientId}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
  const { error } = await client.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  return error ? { error: `Couldn't upload the photo: ${error.message}` } : { path };
}

// Best effort: a leftover file only wastes space.
export async function removePhotos(client: SupabaseClient, paths: string[]) {
  const existing = paths.filter(Boolean);
  if (existing.length) await client.storage.from(BUCKET).remove(existing);
}

export async function removePatientPhotos(client: SupabaseClient, patientId: string) {
  const { data } = await client.storage.from(BUCKET).list(patientId, { limit: 1000 });
  await removePhotos(client, (data ?? []).map((file) => `${patientId}/${file.name}`));
}

// The bucket is private, so pages get short-lived signed URLs. Maps path → URL.
export async function signPhotos(client: SupabaseClient, paths: string[]) {
  const urls = new Map<string, string>();
  const unique = [...new Set(paths.filter(Boolean))];
  if (!unique.length) return urls;
  const { data } = await client.storage.from(BUCKET).createSignedUrls(unique, SIGNED_URL_SECONDS);
  for (const entry of data ?? []) {
    if (entry.path && entry.signedUrl) urls.set(entry.path, entry.signedUrl);
  }
  return urls;
}
