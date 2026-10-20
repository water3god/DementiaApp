import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactCard from "@/components/contactCard";
import { getContacts } from "@/lib/data/contacts";

export default async function Home() {
  const contacts = await getContacts();

  return (
    <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-4 p-4">
      <Card className="aspect-4/3 shadow-lg">
        <CardHeader className="grid-cols-[1fr_auto]">
          <CardTitle className="text-xl">Contacts</CardTitle>
          <Link
            href="/contacts"
            className="text-sm text-muted-foreground hover:underline"
          >
            View all
          </Link>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </CardContent>
      </Card>
      <Card className="aspect-4/3 shadow-lg" >
          <CardHeader className="grid-cols-[1fr_auto]">
            <CardTitle className="text-xl">TodoList</CardTitle>
            <Link
            href="/Todo"
            className="text-sm text-muted-foreground hover:underline"
          >
            View all
          </Link>
          </CardHeader>
      </Card>
      <Card className="col-span-2 aspect-8/3 shadow-lg" />
    </div>
  );
}
