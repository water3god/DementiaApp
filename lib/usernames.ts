import "server-only";
import anyAscii from "any-ascii";

// "Tara Lee" → "taralee", "José O'Neil" → "joseoneil", "李明" → "liming".
// Non-letters are stripped first so any-ascii doesn't spell out emoji as words.
// Capped at 24 characters so a numeric suffix fits profiles.username (max 30).
// Returns "" when nothing is left; callers reject that.
export function usernameBase(name: string) {
  return anyAscii(name.replace(/[^\p{L}\p{M}\p{N}]/gu, ""))
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 24);
}
