import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { ActionResult } from "@/lib/formData";

const MISSING_KEY =
  "SUPABASE_SECRET_KEY is not set. Add a secret key (Project Settings → API Keys) to .env.local and restart the dev server.";

// For server actions: return this before calling createAdminClient(), so the
// form shows the real problem instead of a generic failure.
export function adminConfigError(): ActionResult {
  if (!process.env.SUPABASE_SECRET_KEY) return { error: MISSING_KEY };
}

// Bypasses RLS. Only call it after checking the signed-in user may do the
// thing being done (see app/actions/patients.ts).
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!secretKey) throw new Error(MISSING_KEY);

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
