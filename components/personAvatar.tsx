import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "cn";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export default function PersonAvatar({
  name,
  photoUrl,
  className,
}: {
  name: string;
  photoUrl?: string;
  className?: string;
}) {
  return (
    <Avatar className={cn("size-20", className)}>
      {photoUrl && <AvatarImage src={photoUrl} alt={`Photo of ${name}`} />}
      <AvatarFallback className="text-lg">{initials(name)}</AvatarFallback>
    </Avatar>
  );
}
