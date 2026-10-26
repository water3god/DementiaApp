// Patients log in with a username. Supabase Auth needs an email, so each
// username maps to an address on the reserved .invalid domain, which can
// never receive mail. Must match the backfill filter in supabase/schema.sql.
const PATIENT_EMAIL_DOMAIN = "patients.invalid";

export const MIN_PASSWORD_LENGTH = 8;

export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${PATIENT_EMAIL_DOMAIN}`;
}
