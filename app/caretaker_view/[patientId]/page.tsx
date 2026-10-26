import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import Dashboard from "@/components/dashboard";
import { requireRole } from "@/lib/auth";
import { getPatient } from "@/lib/data/patients";

export default async function ManagePatient({ params }: PageProps<"/caretaker_view/[patientId]">) {
  const [{ patientId }, session] = await Promise.all([params, requireRole("caretaker")]);
  const patient = await getPatient(session.id, patientId);
  if (!patient) notFound();

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/caretaker_view"
        className={buttonVariants({ variant: "ghost", size: "sm", className: "self-start" })}
      >
        <ChevronLeft data-icon="inline-start" />
        All patients
      </Link>
      <Dashboard patientId={patient.id} title={patient.name} photoUrl={patient.photoUrl} editable />
    </div>
  );
}
