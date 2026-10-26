import Dashboard from "@/components/dashboard";
import { requireRole } from "@/lib/auth";

export default async function Home() {
  const session = await requireRole("patient");
  return <Dashboard patientId={session.id} title="Home" />;
}
