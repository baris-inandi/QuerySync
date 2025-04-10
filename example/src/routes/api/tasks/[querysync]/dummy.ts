import type { TasksFilters } from "../../../tasks/[querysync]/qs.svelte";
import type { TasksAPIResponse } from "./+server";

export const getDummyTasks = (filters: TasksFilters): TasksAPIResponse => {
  return {
    tasks: [{ id: 1, title: "Task 1", description: "Description 1", completed: false }]
  };
};
