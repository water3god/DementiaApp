import { createClient } from "@/lib/supabase/server";

export type ContactGroup = "family" | "friends" | "care";

export type Contact = {
  id: number;
  name: string;
  fullName: string;
  relationship: string;
  group: ContactGroup;
  about: string;
  schedule: string;
  phone: string;
  imageUrl: string;
};

export const contactGroups: { id: ContactGroup; label: string }[] = [
  { id: "family", label: "Family" },
  { id: "friends", label: "Friends and neighbors" },
  { id: "care", label: "Care team" },
];

type ContactRow = {
  id: number;
  name: string;
  full_name: string;
  relationship: string;
  contact_group: ContactGroup;
  about: string;
  schedule: string;
  phone: string;
  image_url: string;
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
    imageUrl: row.image_url,
  };
}

// RLS limits every query to the signed-in user's own rows.
export async function getContacts(): Promise<Contact[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, name, full_name, relationship, contact_group, about, schedule, phone, image_url")
    .order("id");
  if (error) throw error;
  return (data as ContactRow[]).map(toContact);
}

export async function getContact(id: number): Promise<Contact | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contacts")
    .select("id, name, full_name, relationship, contact_group, about, schedule, phone, image_url")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toContact(data as ContactRow) : undefined;
}
