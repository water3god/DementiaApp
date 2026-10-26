import AuthForm from "@/components/authForm";
import Centered from "@/components/centered";

export default function Signup() {
  return (
    <Centered>
      <AuthForm mode="signup" />
    </Centered>
  );
}
