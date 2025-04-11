import { querySync, TabularFilters } from "querysync";

export class TasksFilters extends TabularFilters {
  title = "";
  description = "";
  completed = false;
}

export const tasksQs = querySync({
  Filters: TasksFilters,
  pagePath: "/tasks/[querysync]",
  apiPath: "/api/tasks/[querysync]"
});
