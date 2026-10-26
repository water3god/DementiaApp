// Patients log in with a username. Supabase Auth needs an email, so each
// username maps to an address on the reserved .invalid domain, which can
// never receive mail. Must match the backfill filter in supabase/schema.sql.
const PATIENT_EMAIL_DOMAIN = "patients.invalid";

export const MIN_PASSWORD_LENGTH = 8;

// Public sign-up must refuse this domain, or a caretaker account could take a
// patient's login address.
export function isPatientEmail(email: string) {
  return email.trim().toLowerCase().endsWith(`@${PATIENT_EMAIL_DOMAIN}`);
}

export function usernameToEmail(username: string) {
  return `${username.trim().toLowerCase()}@${PATIENT_EMAIL_DOMAIN}`;
}
