import { json } from "@sveltejs/kit";
import { handleQuerySync } from "../../../../lib/handleQuerySync";
import { tasksQs } from "../../../tasks/[querysync]/qs.svelte";
import { getDummyTasks } from "./dummy.js";

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
  } catch (error) {
    console.error(error);
    return json({ error: "Invalid or malformed query string" }, { status: 400 });
  }
}
