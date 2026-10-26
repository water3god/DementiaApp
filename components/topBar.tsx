"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"; 


export default function TopBar() {
  const pathname = usePathname();

  let title = "";
  let linkHref = "";
  let linkText = "";
  let name = "";

  if (pathname.startsWith("/caretaker_view")) {
    title = "Caretaker View"
    linkHref = "/home"
    linkText = "Return to Patient View"
    name = "Emily"
  }

  if (pathname.startsWith("/home")) {
    title = "Patient View"
    linkHref = "/caretaker_view"
    linkText = "Switch to Caretaker View"
    name = "Tara"
  }


  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b bg-background">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-2">
          
          <h1 className="text-xl font-semibold tracking-tight right-align">{title} </h1> 
          <Link
            href= {linkHref}
            className="text-sm text-muted-foreground hover:underline"
          >
          {linkText}
          </Link>
      </div>
    </header>

    
  );
}
