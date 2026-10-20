import Link from "next/link";
import type { Contact } from "@/lib/data/contacts";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import ContactAvatar from "@/components/contactAvatar";

export default function ContactTile({ contact }: { contact: Contact }) {
  return (
    <Item
      render={<Link href="/contacts" />}
      className="flex-col justify-center gap-3 py-4 text-center"
    >
      <ContactAvatar contact={contact} />
      <ItemContent className="items-center gap-0.5">
        <ItemTitle className="text-base">{contact.name}</ItemTitle>
        <ItemDescription>{contact.relationship}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
