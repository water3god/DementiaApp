import PatientsManager from "@/components/patientsManager";
import { requireRole } from "@/lib/auth";
import { getPatients } from "@/lib/data/patients";

export default async function CaretakerView() {
  const session = await requireRole("caretaker");
  const patients = await getPatients(session.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Patients</h1>
      <PatientsManager patients={patients} />
    </div>
  );
}
