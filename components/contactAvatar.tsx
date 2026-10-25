import type { Contact } from "@/lib/data/contacts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export default function ContactAvatar({
  contact,
  className,
}: {
  contact: Contact;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-20", className)}>
      <AvatarImage src={contact.imageUrl} alt={`Photo of ${contact.name}`} />
      <AvatarFallback className="text-lg">{initials(contact.fullName)}</AvatarFallback>
    </Avatar>
  );
}
