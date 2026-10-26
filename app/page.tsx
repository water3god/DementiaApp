import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Main() {
  redirect((await getSession()) ? "/home" : "/signup");
}
