import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import ContactTile from "@/components/contactTile";
import ContactsEditor from "@/components/contactsEditor";
import PersonAvatar from "@/components/personAvatar";
import TodoList from "@/components/todoList";
import WorldMap from "@/components/worldMapLoader";
import { getContacts } from "@/lib/data/contacts";
import { getPlaces } from "@/lib/data/places";
import { getTasks } from "@/lib/data/todos";

function ViewAll({ href }: { href: string }) {
  return (
    <Link href={href} className={buttonVariants({ variant: "ghost", size: "sm" })}>
      View all
      <ChevronRight data-icon="inline-end" />
    </Link>
  );
}

// A patient's home screen. editable (caretaker view) shows the same panels
// with controls to add, edit and delete contacts, tasks and places.
export default async function Dashboard({
  patientId,
  title,
  photoUrl,
  editable = false,
}: {
  patientId: string;
  title: string;
  photoUrl?: string;
  editable?: boolean;
}) {
  const [contacts, tasks, places] = await Promise.all([
    getContacts(patientId),
    getTasks(patientId),
    getPlaces(patientId),
  ]);
  // Editors get the patient's id for new rows; the patient's own view gets none.
  const editFor = editable ? patientId : undefined;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        {photoUrl && <PersonAvatar name={title} photoUrl={photoUrl} className="size-14" />}
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          <p className="text-muted-foreground">{today}</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            {!editable && (
              <CardAction>
                <ViewAll href="/contacts" />
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            {editable ? (
              <ContactsEditor patientId={patientId} contacts={contacts} />
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                {contacts.slice(0, 4).map((contact) => (
                  <ContactTile key={contact.id} contact={contact} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>To-do list</CardTitle>
            {!editable && (
              <CardAction>
                <ViewAll href="/Todo" />
              </CardAction>
            )}
          </CardHeader>
          <CardContent>
            <TodoList tasks={tasks} patientId={editFor} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Places</CardTitle>
          </CardHeader>
          <CardContent>
            <WorldMap places={places} patientId={editFor} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
