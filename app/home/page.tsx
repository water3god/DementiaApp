import Link from "next/link";
import { ChevronRight, LayoutGrid } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import ContactTile from "@/components/contactTile";
import TodoList from "@/components/todoList";
import { getContacts } from "@/lib/data/contacts";
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
  const [contacts, tasks] = await Promise.all([getContacts(), getTasks()]);
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
          <CardContent>
            <Empty className="border border-dashed">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <LayoutGrid />
                </EmptyMedia>
                <EmptyTitle>Coming soon</EmptyTitle>
                <EmptyDescription>
                  More features will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
