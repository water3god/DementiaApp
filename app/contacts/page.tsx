import ContactCard from "@/components/contactCard";
import { getContacts } from "@/lib/data/contacts";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <main className="mx-auto w-full max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-semibold">Contacts</h1>
      <div className="flex flex-col gap-4">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </main>
  );
}
