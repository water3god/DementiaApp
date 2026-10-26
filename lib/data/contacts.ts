import { createClient } from "@/lib/supabase/server";
import type { ContactGroup } from "@/lib/data/contactGroups";
import { photoUrl } from "@/lib/photos";

export type Contact = {
  id: number;
  name: string;
  fullName: string;
  relationship: string;
  group: ContactGroup;
  about: string;
  schedule: string;
  phone: string;
  photoUrl?: string;
};

type ContactRow = {
  id: number;
  name: string;
  full_name: string;
  relationship: string;
  contact_group: ContactGroup;
  about: string;
  schedule: string;
  phone: string;
  photo_path: string;
};

function toContact(row: ContactRow): Contact {
  return {
    id: row.id,
    name: row.name,
    fullName: row.full_name,
    relationship: row.relationship,
    group: row.contact_group,
    about: row.about,
    schedule: row.schedule,
    phone: row.phone,
    photoUrl: photoUrl(row.photo_path),
  };
}

// RLS limits reads to the patient themselves and their caretaker.
export async function getContacts(patientId: string): Promise<Contact[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, name, full_name, relationship, contact_group, about, schedule, phone, photo_path")
    .eq("patient_id", patientId)
    .order("id");
  if (error) throw error;
  return (data as ContactRow[]).map(toContact);
}
