import { json } from "@sveltejs/kit";
import { handleQuerySync } from "querysync";
import { tasksQs } from "../../../tasks/[querysync]/qs.svelte";
import { getDummyTasks } from "./dummy";

export interface TasksAPIResponse {
  tasks: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }[];
}

export async function GET() {
  const { valid, filters } = await handleQuerySync(tasksQs);

  if (!valid) {
    return json({ error: "Invalid QuerySync string" }, { status: 400 });
  }

  const out: TasksAPIResponse = getDummyTasks(filters);

  return json(out);
}
