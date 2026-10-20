// Data access for the to-do list. Pages and components only call these
// functions, so swapping the mock table for a real database only touches this file.
//
// Tasks are written by a family member or caregiver, from the patient's
// point of view. Keep each one short and concrete.

export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

const tasks: Task[] = [
  { id: "1", text: "Take your morning pills", completed: false },
  { id: "2", text: "Drink a glass of water", completed: false },
  { id: "3", text: "Call Maggie after lunch", completed: false },
  { id: "4", text: "Water the plants on the windowsill", completed: false },
  { id: "5", text: "Go for a short walk", completed: false },
];

export async function getTasks(): Promise<Task[]> {
  return tasks;
}
