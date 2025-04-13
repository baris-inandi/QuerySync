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

export async function GET({ params }) {
  try {
    const qs = await handleQuerySync(tasksQs, params.querysync);
    return json(getDummyTasks(qs.filters), { status: 200 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return json({ error: "Invalid or malformed query string" }, { status: 400 });
  }
}
