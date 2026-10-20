import ContactCard from "@/components/contactCard";
import { contactGroups, getContacts } from "@/lib/data/contacts";

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="flex w-full max-w-3xl flex-col gap-8">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Contacts
      </h1>
      {contactGroups.map((group) => {
        const members = contacts.filter((c) => c.group === group.id);
        if (members.length === 0) return null;

        return (
          <section key={group.id} className="flex flex-col gap-4">
            <h2 className="font-heading text-lg font-medium">{group.label}</h2>
            <div className="flex flex-col gap-4">
              {members.map((contact) => (
                <ContactCard key={contact.id} contact={contact} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
