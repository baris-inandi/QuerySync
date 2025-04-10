import { TabularFilters, type QuerySyncOptions } from "querysync";

export class TasksFilters extends TabularFilters {
  title = "";
  description = "";
  completed = false;
}

export const tasksOptions: QuerySyncOptions<TasksFilters> = {
  filters: TasksFilters,
  pagePath: "/tasks/{query}",
  apiPath: "/api/tasks/{query}"
};
