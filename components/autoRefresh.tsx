"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Re-renders signed-in pages now and then so a screen left open, like a
// patient's tablet, picks up changes the caretaker made. Client state such as
// open dialogs survives.
const REFRESH_MS = 30 * 60 * 1000;

export default function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    let last = Date.now();
    const refresh = () => {
      last = Date.now();
      router.refresh();
    };
    const timer = setInterval(refresh, REFRESH_MS);
    // Timers are paused while a device sleeps, so check again when it wakes.
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - last > REFRESH_MS) refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

  return null;
}
