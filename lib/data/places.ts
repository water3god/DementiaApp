import { createClient } from "@/lib/supabase/server";

export type Place = {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
};

// RLS limits reads to the patient themselves and their caretaker.
export async function getPlaces(patientId: string): Promise<Place[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select("id, name, description, lat, lng")
    .eq("patient_id", patientId)
    .order("id");
  if (error) throw error;
  return data;
}
