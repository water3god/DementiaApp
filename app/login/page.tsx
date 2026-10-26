import AuthForm from "@/components/authForm";
import Centered from "@/components/centered";

export default async function Login({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const initialError =
    error === "confirm" ? "That confirmation link didn't work. Try logging in, or sign up again." : undefined;

  return (
    <Centered>
      <AuthForm mode="login" initialError={initialError} />
    </Centered>
  );
}
