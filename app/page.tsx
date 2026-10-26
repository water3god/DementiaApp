import { redirect } from "next/navigation";
import { getSession, homeFor } from "@/lib/auth";

export default async function Main() {
  const session = await getSession();
  redirect(session ? homeFor(session.role) : "/login");
}
