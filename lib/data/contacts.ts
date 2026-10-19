// Data access for contacts. Pages and components only call these functions,
// so swapping the mock table for a real database only touches this file.
//
// To go live: replace the bodies below with queries against your database
// (e.g. `db.select().from(contacts)` with Drizzle, or `prisma.contact.findMany()`),
// keeping the same signatures and return types.

export type Contact = {
  id: string;
  name: string;
  relationship: string;
  description: string;
  /** Public path or absolute URL. Remote hosts must be added to `images.remotePatterns` in next.config.ts. */
  imageUrl: string;
};

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Margaret Lee",
    relationship: "Daughter",
    description:
      "Margaret visits every Sunday afternoon. She lives nearby with her husband Tom and loves gardening.",
    imageUrl: "/contacts/margaret.svg",
  },
  {
    id: "2",
    name: "David Lee",
    relationship: "Son",
    description:
      "David lives in Seattle and calls every Wednesday evening. He works as an engineer and has two kids.",
    imageUrl: "/contacts/david.svg",
  },
  {
    id: "3",
    name: "Emily Carter",
    relationship: "Caregiver",
    description:
      "Emily helps with medications and meals on weekday mornings. She has been your caregiver for two years.",
    imageUrl: "/contacts/emily.svg",
  },
  {
    id: "4",
    name: "James Walker",
    relationship: "Neighbor",
    description:
      "James lives next door and walks his dog, Biscuit, past the house most mornings.",
    imageUrl: "/contacts/james.svg",
  },
];

export async function getContacts(): Promise<Contact[]> {
  return mockContacts;
}

export async function getContact(id: string): Promise<Contact | undefined> {
  return mockContacts.find((contact) => contact.id === id);
}
