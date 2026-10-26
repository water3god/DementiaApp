import Link from "next/link";
import type { Contact } from "@/lib/data/contacts";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import PersonAvatar from "@/components/personAvatar";

// With onClick (caretaker view) the tile opens the edit menu instead of linking.
export default function ContactTile({
  contact,
  onClick,
}: {
  contact: Contact;
  onClick?: () => void;
}) {
  return (
    <Item
      render={
        onClick ? (
          <button type="button" onClick={onClick} aria-label={`Edit ${contact.name}`} />
        ) : (
          <Link href="/contacts" />
        )
      }
      className="flex-col justify-center gap-3 py-4 text-center [button]:cursor-pointer [button]:hover:bg-muted"
    >
      <PersonAvatar name={contact.fullName} photoUrl={contact.photoUrl} />
      <ItemContent className="items-center gap-0.5">
        <ItemTitle className="text-base">{contact.name}</ItemTitle>
        <ItemDescription>{contact.relationship}</ItemDescription>
      </ItemContent>
    </Item>
  );
}
