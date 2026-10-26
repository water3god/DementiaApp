import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function Field({
  id,
  label,
  multiline,
  ...props
}: { id: string; label: string; multiline?: boolean } & React.ComponentProps<"input">) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {multiline ? (
        <Textarea
          id={id}
          name={id}
          defaultValue={props.defaultValue}
          placeholder={props.placeholder}
          required={props.required}
        />
      ) : (
        <Input id={id} name={id} {...props} />
      )}
    </div>
  );
}
