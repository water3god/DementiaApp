import { createClient } from "@/lib/supabase/server";

export type Session = {
  name: string;
  email: string;
};

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return null;

  const email = claims.email ?? "";
  // Display only: user_metadata is user-editable, never use it for authorization.
  const name = (claims.user_metadata?.name as string | undefined) ?? email;
  return { name, email };
}
