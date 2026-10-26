"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Pencil, UserPlus, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import EditDialog, { AddButton } from "@/components/editDialog";
import Field from "@/components/field";
import PersonAvatar from "@/components/personAvatar";
import PhotoField from "@/components/photoField";
import { createPatient, deletePatient, updatePatient } from "@/app/actions/patients";
import type { Patient } from "@/lib/data/patients";
import { MIN_PASSWORD_LENGTH } from "@/lib/patientLogin";

export default function PatientsManager({ patients }: { patients: Patient[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Patient>();

  function openFor(patient?: Patient) {
    setEditing(patient);
    setOpen(true);
  }

  return (
    <div className="flex flex-col gap-3">
      {patients.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>No patients yet</EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-2">
          {patients.map((patient) => (
            <Item key={patient.id} variant="outline">
              <ItemMedia>
                <PersonAvatar name={patient.name} photoUrl={patient.photoUrl} className="size-12" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className="text-base">{patient.name}</ItemTitle>
                <ItemDescription>{patient.username}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${patient.name}'s profile`}
                  onClick={() => openFor(patient)}
                >
                  <Pencil />
                </Button>
                <Link
                  href={`/caretaker_view/${patient.id}`}
                  className={buttonVariants({ size: "sm" })}
                >
                  Manage
                  <ChevronRight data-icon="inline-end" />
                </Link>
              </ItemActions>
            </Item>
          ))}
        </div>
      )}

      <AddButton onClick={() => openFor()}>
        <UserPlus data-icon="inline-start" />
        Add patient
      </AddButton>

      <EditDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${editing.name}` : "Add a patient"}
        submitLabel={editing ? "Save changes" : "Add patient"}
        onSubmit={(formData) => (editing ? updatePatient(editing.id, formData) : createPatient(formData))}
        onDelete={editing && (() => deletePatient(editing.id))}
      >
        {/* Keyed so the fields reset when switching between patients. */}
        <div key={editing?.id ?? "new"} className="flex flex-col gap-3">
          <PhotoField name={editing?.name ?? ""} photoUrl={editing?.photoUrl} />
          <Field id="name" label="Name" placeholder="Tara Lee" defaultValue={editing?.name} required />
          <Field
            id="password"
            label={editing ? "New password" : "Password"}
            type="password"
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            required={!editing}
          />
        </div>
      </EditDialog>
    </div>
  );
}
