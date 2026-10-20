// Data access for contacts. Pages and components only call these functions,
// so swapping the mock table for a real database only touches this file.
//
// To go live: replace the bodies below with queries against your database
// (e.g. `db.select().from(contacts)` with Drizzle, or `prisma.contact.findMany()`),
// keeping the same signatures and return types.
//
// Contacts are written by a family member or caregiver, from the patient's
// point of view. Keep each field short, warm, and in the present tense.

export type ContactGroup = "family" | "friends" | "care";

export type Contact = {
  id: string;
  /** The name the patient actually calls them, e.g. "Maggie". */
  name: string;
  fullName: string;
  /** Written from the patient's side, e.g. "Your daughter". */
  relationship: string;
  group: ContactGroup;
  /** One or two concrete, familiar details that help the patient place them. */
  about: string;
  /** When the patient sees or hears from them, e.g. "Visits every Sunday afternoon". */
  schedule: string;
  phone: string;
  /** Public path or absolute URL. Remote hosts must be added to `images.remotePatterns` in next.config.ts. */
  imageUrl: string;
};

export const contactGroups: { id: ContactGroup; label: string }[] = [
  { id: "family", label: "Family" },
  { id: "friends", label: "Friends and neighbors" },
  { id: "care", label: "Care team" },
];

// Ordered by closeness: the people the patient sees most come first.
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Maggie",
    fullName: "Margaret Lee",
    relationship: "Your daughter",
    group: "family",
    about:
      "She lives nearby with her husband Tom. She grows the tomatoes you like and brings some when she visits.",
    schedule: "Visits every Sunday afternoon",
    phone: "+1 555 010 1234",
    imageUrl: "/contacts/margaret.svg",
  },
  {
    id: "2",
    name: "David",
    fullName: "David Lee",
    relationship: "Your son",
    group: "family",
    about:
      "He lives in Seattle with his wife Anna and your grandchildren, Sam and Lily.",
    schedule: "Calls every Wednesday evening",
    phone: "+1 555 010 5678",
    imageUrl: "/contacts/david.svg",
  },
  {
    id: "3",
    name: "James",
    fullName: "James Walker",
    relationship: "Your neighbor",
    group: "friends",
    about: "He lives next door. His dog, Biscuit, likes to say hello.",
    schedule: "Walks past most mornings",
    phone: "+1 555 010 2468",
    imageUrl: "/contacts/james.svg",
  },
  {
    id: "4",
    name: "Emily",
    fullName: "Emily Carter",
    relationship: "Your caregiver",
    group: "care",
    about: "She helps you with your medicine and makes breakfast with you.",
    schedule: "Here weekday mornings, 8am to noon",
    phone: "+1 555 010 1357",
    imageUrl: "/contacts/emily.svg",
  },
];

export async function getContacts(): Promise<Contact[]> {
  return mockContacts;
}

export async function getContact(id: string): Promise<Contact | undefined> {
  return mockContacts.find((contact) => contact.id === id);
}
