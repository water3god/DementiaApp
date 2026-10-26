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

export default async function Home() {
  const [contacts, tasks, places] = await Promise.all([
    getContacts(),
    getTasks(),
    getPlaces(),
  ]);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Home
        </h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardAction>
              <ViewAll href="/contacts" />
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {contacts.slice(0, 4).map((contact) => (
              <ContactTile key={contact.id} contact={contact} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>To-do list</CardTitle>
            <CardAction>
              <ViewAll href="/Todo" />
            </CardAction>
          </CardHeader>
          <CardContent>
            <TodoList tasks={tasks} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Places</CardTitle>
          </CardHeader>
          <CardContent>
            <WorldMap places={places} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
