import { createClient } from "@/lib/supabase/server";

export type Place = {
  id: number;
  name: string;
  description: string;
  lat: number;
  lng: number;
};

// RLS limits every query to the signed-in user's own rows.
export async function getPlaces(): Promise<Place[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select("id, name, description, lat, lng")
    .order("id");
  if (error) throw error;
  return data;
}
