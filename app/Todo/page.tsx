import TodoList from "@/components/todoList";
import { requireRole } from "@/lib/auth";
import { getTasks } from "@/lib/data/todos";

export default async function TodoPage() {
  const session = await requireRole("patient");
  const tasks = await getTasks(session.id);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        To-do list
      </h1>
      <TodoList tasks={tasks} />
    </div>
  );
}
