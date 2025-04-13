import { defineQuerySync, TabularFilters } from "querysync";

export class TasksFilters extends TabularFilters {
  title = "";
  description = "";
  completedOnly = false;
}

export const tasksQs = defineQuerySync({
  filters: TasksFilters,
  pagePath: "/tasks/{query}",
  apiPath: "/api/tasks/{query}"
});
