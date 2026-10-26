"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminConfigError, createAdminClient } from "@/lib/supabase/admin";
import { homeFor, type Role } from "@/lib/auth";
import { isPatientEmail, MIN_PASSWORD_LENGTH, usernameToEmail } from "@/lib/patientLogin";

export type AuthState = { error?: string; message?: string } | undefined;

// Caretakers log in with their email, patients with the username their
// caretaker gave them.
export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const email = identifier.includes("@") ? identifier : usernameToEmail(identifier);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: String(formData.get("password") ?? ""),
  });
  if (error) {
    return {
      error: error.code === "invalid_credentials" ? "Wrong email, username or password." : error.message,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle<{ role: Role }>();
  if (profileError) {
    await supabase.auth.signOut();
    return { error: `Couldn't load your profile: ${profileError.message}` };
  }
  if (!profile) {
    await supabase.auth.signOut();
    return { error: "This account isn't set up for the app. Ask your caretaker, or sign up again." };
  }
  redirect(homeFor(profile.role));
}

// Public sign-up is for caretakers only; patients are created by a caretaker.
export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Please fill in every field." };
  }
  if (isPatientEmail(email)) return { error: "Please use your own email address." };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Use a password of at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  // Checked before signing up so no login is created that can't get a profile.
  const configError = adminConfigError();
  if (configError) return configError;

  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) return { error: error.message };

  // With email confirmation on, signing up an address that's already taken
  // returns a placeholder user with no identities; there's nothing to set up.
  const user = data.user;
  if (user && user.identities?.length) {
    const admin = createAdminClient();
    const { error: profileError } = await admin
      .from("profiles")
      .insert({ id: user.id, role: "caretaker", name });
    if (profileError) {
      // Don't leave a login behind that the app can't use.
      await admin.auth.admin.deleteUser(user.id);
      return { error: "Couldn't finish creating your account. Please try again." };
    }
  }

  // No session means the project requires email confirmation first.
  if (!data.session) {
    return { message: "Check your email for a link to finish signing up." };
  }
  redirect(homeFor("caretaker"));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
