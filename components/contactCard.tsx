import { CalendarClock, Phone } from "lucide-react";
import type { Contact } from "@/lib/data/contacts";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactAvatar from "@/components/contactAvatar";
import { cn } from "@/lib/utils";

export default function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-4">
        <ContactAvatar contact={contact} />
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
      </CardContent>
      <CardFooter className="justify-end">
        <a
          href={`tel:${contact.phone.replace(/\s/g, "")}`}
          className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
        >
          <Phone data-icon="inline-start" />
          Call {contact.name}
        </a>
      </CardFooter>
    </Card>
  );
}
