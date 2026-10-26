import { createAdminClient } from "@/lib/supabase/admin";

// Vercel Cron calls this daily (see vercel.json) so a free Supabase project
// is never idle long enough to be paused. Vercel sends CRON_SECRET as a
// bearer token; anyone else is turned away.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { error } = await createAdminClient().from("profiles").select("id").limit(1);
  if (error) return new Response(error.message, { status: 500 });
  return new Response("ok");
}
