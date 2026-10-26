import { createClient } from "@/lib/supabase/server";
import { photoUrl } from "@/lib/photos";

export type Patient = {
  id: string;
  name: string;
  username: string;
  photoUrl?: string;
};

type PatientRow = Omit<Patient, "photoUrl"> & { photo_path: string };

const COLUMNS = "id, name, username, photo_path";

function toPatient({ photo_path, ...patient }: PatientRow): Patient {
  return { ...patient, photoUrl: photoUrl(photo_path) };
}

// RLS only returns patients whose caretaker is the signed-in user.
export async function getPatients(caretakerId: string): Promise<Patient[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(COLUMNS)
    .eq("role", "patient")
    .eq("caretaker_id", caretakerId)
    .order("name");
  if (error) throw error;
  return data.map(toPatient);
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// For server actions: confirms the caretaker manages the patient.
export async function getPatientRow(caretakerId: string, id: string): Promise<PatientRow | undefined> {
  // id comes from the URL; anything that isn't a uuid would make Postgres error.
  if (!UUID.test(id)) return undefined;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(COLUMNS)
    .eq("role", "patient")
    .eq("caretaker_id", caretakerId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ?? undefined;
}

export async function getPatient(caretakerId: string, id: string): Promise<Patient | undefined> {
  const row = await getPatientRow(caretakerId, id);
  return row && toPatient(row);
}
