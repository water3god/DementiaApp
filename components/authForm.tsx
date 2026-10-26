"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login, signup } from "@/app/actions/auth";

type Mode = "login" | "signup";

const copy = {
  login: {
    title: "Log in",
    description: "Welcome back.",
    submit: "Log in",
    switchText: "Don't have an account?",
    switchLabel: "Sign up",
    switchHref: "/signup",
  },
  signup: {
    title: "Sign up",
    description: "Create an account to get started.",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLabel: "Log in",
    switchHref: "/login",
  },
};

function Field({ id, label, ...props }: { id: string; label: string } & React.ComponentProps<"input">) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input id={id} name={id} required {...props} />
    </div>
  );
}

export default function AuthForm({
  mode,
  initialError,
}: {
  mode: Mode;
  initialError?: string;
}) {
  const [state, formAction, pending] = useActionState(
    mode === "login" ? login : signup,
    initialError ? { error: initialError } : undefined,
  );
  const text = copy[mode];

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="flex flex-col gap-4">
          {mode === "signup" && (
            <Field id="name" label="Name" autoComplete="name" />
          )}
          <Field id="email" label="Email" type="email" autoComplete="email" />
          <Field
            id="password"
            label="Password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          {state?.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          {state?.message && (
            <p role="status" className="text-sm text-muted-foreground">
              {state.message}
            </p>
          )}
        </CardContent>
        <CardFooter className="mt-4 flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={pending}>
            {text.submit}
          </Button>
          <p className="text-sm text-muted-foreground">
            {text.switchText}{" "}
            <Link href={text.switchHref} className="text-foreground underline-offset-4 hover:underline">
              {text.switchLabel}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
