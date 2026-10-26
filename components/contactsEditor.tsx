"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ContactTile from "@/components/contactTile";
import EditDialog, { AddButton } from "@/components/editDialog";
import Field from "@/components/field";
import PhotoField from "@/components/photoField";
import { deleteContact, saveContact } from "@/app/actions/contacts";
import { contactGroups } from "@/lib/data/contactGroups";
import type { Contact } from "@/lib/data/contacts";

const groupItems = contactGroups.map((g) => ({ value: g.id, label: g.label }));

export default function ContactsEditor({
  patientId,
  contacts,
}: {
  patientId: string;
  contacts: Contact[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact>();

  function openFor(contact?: Contact) {
    setEditing(contact);
    setOpen(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
        {contacts.map((contact) => (
          <ContactTile key={contact.id} contact={contact} onClick={() => openFor(contact)} />
        ))}
      </div>
      <AddButton onClick={() => openFor()}>
        <UserPlus data-icon="inline-start" />
        Add contact
      </AddButton>

      <EditDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? `Edit ${editing.name}` : "Add a contact"}
        submitLabel={editing ? "Save changes" : "Add contact"}
        onSubmit={(formData) => saveContact(patientId, editing?.id, formData)}
        onDelete={editing && (() => deleteContact(editing.id))}
      >
        {/* Keyed so the fields reset when switching between contacts. */}
        <div key={editing?.id ?? "new"} className="flex flex-col gap-3">
          <PhotoField name={editing?.fullName ?? ""} photoUrl={editing?.photoUrl} />
          <Field id="name" label="Name" placeholder="Maggie" defaultValue={editing?.name} required />
          <Field id="fullName" label="Full name" placeholder="Margaret Lee" defaultValue={editing?.fullName} />
          <Field
            id="relationship"
            label="Relationship"
            placeholder="Your daughter"
            defaultValue={editing?.relationship}
            required
          />
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Group</span>
            <Select name="group" items={groupItems} defaultValue={editing?.group ?? "family"}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {groupItems.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Field id="phone" label="Phone" type="tel" placeholder="+1 555 010 1234" defaultValue={editing?.phone} />
          <Field
            id="schedule"
            label="Schedule"
            placeholder="Visits every Sunday afternoon"
            defaultValue={editing?.schedule}
          />
          <Field
            id="about"
            label="About"
            multiline
            defaultValue={editing?.about}
          />
        </div>
      </EditDialog>
    </div>
  );
}
