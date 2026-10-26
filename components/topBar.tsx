import Link from "next/link";
import { CircleUser, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";

export default async function TopBar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="font-heading text-base font-semibold">
          Dementia App
        </Link>
        {session ? (
          <div className="flex items-center gap-2">
            {session.role === "caretaker" && (
              <Link href="/caretaker_view" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                <Users data-icon="inline-start" />
                Patients
              </Link>
            )}
            <span className="hidden items-center gap-1.5 text-sm font-medium sm:flex">
              <CircleUser className="size-4 text-muted-foreground" />
              {session.name}
            </span>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm">
                Log out
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              Log in
            </Link>
            <Link href="/signup" className={buttonVariants({ size: "sm" })}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
