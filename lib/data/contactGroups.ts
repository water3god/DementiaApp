// Kept apart from contacts.ts so client components can import it
// without pulling in the server-only Supabase client.
export type ContactGroup = "family" | "friends" | "care";

export const contactGroups: { id: ContactGroup; label: string }[] = [
  { id: "family", label: "Family" },
  { id: "friends", label: "Friends and neighbors" },
  { id: "care", label: "Care team" },
];
