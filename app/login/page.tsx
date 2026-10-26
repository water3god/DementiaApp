import AuthForm from "@/components/authForm";

export default async function Login({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const initialError =
    error === "confirm" ? "That confirmation link didn't work. Try logging in, or sign up again." : undefined;

  return (
    <div className="flex flex-1 items-center justify-center">
      <AuthForm mode="login" initialError={initialError} />
    </div>
  );
}
