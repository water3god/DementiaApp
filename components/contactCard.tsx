import { CalendarClock, Phone } from "lucide-react";
import type { Contact } from "@/lib/data/contacts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PersonAvatar from "@/components/personAvatar";

export default function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-4">
        <PersonAvatar name={contact.fullName} photoUrl={contact.photoUrl} />
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg">{contact.name}</CardTitle>
          <CardDescription>{contact.relationship}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <p className="max-w-prose leading-relaxed">{contact.about}</p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <CalendarClock className="size-4 shrink-0" aria-hidden />
          {contact.schedule}
        </p>
        {contact.phone && (
          <p className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-4 shrink-0" aria-hidden />
            {contact.phone}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
