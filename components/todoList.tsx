"use client";

import { useState } from "react";
import { ListPlus, ListTodo, Pencil } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import EditDialog, { AddButton } from "@/components/editDialog";
import Field from "@/components/field";
import { deleteTask, saveTask, setTaskCompleted } from "@/app/actions/tasks";
import type { Task } from "@/lib/data/todos";

// Pass patientId (caretaker view) to add an edit button per task and an add button below.
export default function TodoList({
  tasks,
  patientId,
}: {
  tasks: Task[];
  patientId?: string;
}) {
  const editable = patientId !== undefined;
  const [done, setDone] = useState(
    () => new Set(tasks.filter((t) => t.completed).map((t) => t.id)),
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Task>();

  function mark(id: number, checked: boolean) {
    setDone((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  async function toggle(id: number, checked: boolean) {
    mark(id, checked);
    try {
      await setTaskCompleted(id, checked);
    } catch {
      mark(id, !checked); // Save failed: undo the checkmark.
    }
  }

  function openFor(task?: Task) {
    setEditing(task);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListTodo />
            </EmptyMedia>
            <EmptyTitle>Nothing to do right now</EmptyTitle>
            {!editable && (
              <EmptyDescription>
                Your family or caregiver will add tasks here for you.
              </EmptyDescription>
            )}
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col divide-y">
          {tasks.map((task) => {
            const checked = done.has(task.id);
            return (
              <li key={task.id} className="flex items-center gap-2">
                <label className="flex flex-1 cursor-pointer items-center gap-3 py-3">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(value) => toggle(task.id, value)}
                  />
                  <span
                    className={cn(
                      "text-base",
                      checked && "text-muted-foreground line-through",
                    )}
                  >
                    {task.text}
                  </span>
                </label>
                {editable && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit "${task.text}"`}
                    onClick={() => openFor(task)}
                  >
                    <Pencil />
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {editable && (
        <>
          <AddButton onClick={() => openFor()}>
            <ListPlus data-icon="inline-start" />
            Add task
          </AddButton>
          <EditDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            title={editing ? "Edit task" : "Add a task"}
            submitLabel={editing ? "Save changes" : "Add task"}
            onSubmit={(formData) => saveTask(patientId!, editing?.id, formData)}
            onDelete={editing && (() => deleteTask(editing.id))}
          >
            <Field
              key={editing?.id ?? "new"}
              id="text"
              label="Task"
              placeholder="Take your morning pills"
              defaultValue={editing?.text}
              required
              autoFocus
            />
          </EditDialog>
        </>
      )}
    </div>
  );
}
