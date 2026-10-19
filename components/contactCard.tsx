import Image from "next/image";
import type { Contact } from "@/lib/data/contacts";

export default function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center gap-4">
        <Image
          src={contact.imageUrl}
          alt={`Photo of ${contact.name}`}
          width={72}
          height={72}
          className="size-18 shrink-0 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold">{contact.name}</p>
          <p className="text-sm text-muted-foreground">
            {contact.relationship}
          </p>
        </div>
      </div>
      <p className="text-sm leading-relaxed">{contact.description}</p>
    </div>
  );
}
