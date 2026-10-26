"use client";

import { useState } from "react";
import { ListTodo } from "lucide-react";
import { cn } from "cn";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { setTaskCompleted } from "@/app/actions/tasks";
import type { Task } from "@/lib/data/todos";

export default function TodoList({ tasks }: { tasks: Task[] }) {
  const [done, setDone] = useState(
    () => new Set(tasks.filter((t) => t.completed).map((t) => t.id)),
  );

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

  if (tasks.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ListTodo />
          </EmptyMedia>
          <EmptyTitle>Nothing to do right now</EmptyTitle>
          <EmptyDescription>
            Your family or caregiver will add tasks here for you.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul className="flex flex-col divide-y">
      {tasks.map((task) => {
        const checked = done.has(task.id);
        return (
          <li key={task.id}>
            <label className="flex cursor-pointer items-center gap-3 py-3">
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
          </li>
        );
      })}
    </ul>
  );
}
