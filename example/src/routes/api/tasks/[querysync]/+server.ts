import { json } from "@sveltejs/kit";
import { QuerySync } from "querysync";
import { TasksFilters } from "../../../tasks/[querysync]/qs.svelte";

export interface TasksAPIResponse {
  tasks: {
    id: number;
    title: string;
    description: string;
    completed: boolean;
  }[];
}

export async function GET({ params }) {
  const qs = new QuerySync(TasksFilters);
  const filters = await qs.fromString(params.querysync);

  const out: TasksAPIResponse = getDummyTasks(filters);

  return json(out);
}
