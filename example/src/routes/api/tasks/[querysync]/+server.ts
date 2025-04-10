import { json } from "@sveltejs/kit";
import { QuerySync } from "querysync";
import { TasksFilters } from "../../../tasks/[querysync]/qs.svelte";
import { getDummyTasks } from "./dummy";

export interface TasksAPIResponse {
  tasks: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }[];
}

export async function GET({ params }) {
  let qs: QuerySync<TasksFilters>;
  try {
    qs = await QuerySync.fromString(TasksFilters, params.querysync);
  } catch (error) {
    return json({ error: "Invalid QuerySync string " + error }, { status: 400 });
  }

  const out: TasksAPIResponse = getDummyTasks(qs.filters);

  return json(out);
}
