import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "caretaker" | "patient";

export type Session = {
  id: string;
  role: Role;
  name: string;
};

export const homeFor = (role: Role) => (role === "caretaker" ? "/caretaker_view" : "/home");

// Cached so the top bar and the page share one lookup per request.
export const getSession = cache(async (): Promise<Session | null> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return null;

  // The profile, not the JWT, holds the role: it's written only by the server.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, name")
    .eq("id", userId)
    .maybeSingle();
  return profile;
});

// For pages: sends signed-out users to log in and the other role to their own home.
export async function requireRole(role: Role): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== role) redirect(homeFor(session.role));
  return session;
}
