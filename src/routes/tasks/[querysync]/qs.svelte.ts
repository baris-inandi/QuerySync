import { defineQuerySync } from "../../../lib/defineQuerySync";
import { TabularFilters } from "../../../lib/filters";

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
