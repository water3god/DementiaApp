"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ActionResult } from "@/lib/formData";

// Shared shell for the caretaker's add/edit menus: shows errors, disables
// buttons while saving, closes on success, and asks twice before deleting.
export default function EditDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel,
  onSubmit,
  onDelete,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<ActionResult>;
  onDelete?: () => Promise<ActionResult>;
  children: React.ReactNode;
}) {
  const [error, setError] = useState<string>();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  function changeOpen(next: boolean) {
    if (!next) {
      setError(undefined);
      setConfirmDelete(false);
    }
    onOpenChange(next);
  }

  function run(action: () => Promise<ActionResult>) {
    startTransition(async () => {
      const result = await action().catch(() => ({ error: "Something went wrong. Please try again." }));
      if (result?.error) setError(result.error);
      else changeOpen(false);
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Not a form action: those reset the fields, which would wipe them on an error.
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    run(() => onSubmit(formData));
  }

  return (
    <Dialog open={open} onOpenChange={changeOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto p-0.5">
            {children}
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <DialogFooter>
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="sm:mr-auto"
                disabled={pending}
                onClick={() => (confirmDelete ? run(onDelete) : setConfirmDelete(true))}
              >
                <Trash2 data-icon="inline-start" />
                {confirmDelete ? "Tap again to delete" : "Delete"}
              </Button>
            )}
            <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function AddButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full border-dashed text-muted-foreground hover:text-foreground"
      {...props}
    >
      {children}
    </Button>
  );
}
