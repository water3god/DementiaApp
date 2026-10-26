import { createClient } from "@/lib/supabase/server";
import { downloadPhoto, isPhotoPath } from "@/lib/photos";

// Serves a photo from the private bucket to a signed-in user. The download
// runs as that user, so storage RLS decides access: the patient and their
// caretaker get the image, everyone else a 404. Uploads always get a new
// random path, so a URL's content never changes and browsers can cache it.
export async function GET(_request: Request, ctx: RouteContext<"/photos/[...path]">) {
  const path = (await ctx.params).path.join("/");
  if (!isPhotoPath(path)) return new Response("Not found", { status: 404 });

  const photo = await downloadPhoto(await createClient(), path);
  if (!photo) return new Response("Not found", { status: 404 });

  return new Response(photo, {
    headers: {
      "Content-Type": photo.type,
      // private: browsers only, never a shared cache.
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
