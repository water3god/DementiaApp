import { redirect } from "next/navigation";

export default function Main() {
  const loggedIn = false;

  if (loggedIn) {
    redirect("/home");
  } else {
    redirect("/login");
  }
}
