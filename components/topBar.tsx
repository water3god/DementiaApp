import Link from "next/link";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/home" className="font-heading text-base font-semibold">
          Dementia App
        </Link>
      </div>
    </header>
  );
}
