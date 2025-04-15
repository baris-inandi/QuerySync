import { QuerySync } from '../../../lib/QuerySync.svelte';
import { TabularFilters } from '../../../lib/utils/filters';
import type { TasksAPIResponse } from '../../api/tasks/[querysync]/+server';
export class TasksFilters extends TabularFilters {
	title = '';
	description = '';
	completedOnly = false;
}

export const tasksQs = new QuerySync<TasksFilters, TasksAPIResponse>({
	filters: TasksFilters,
	pagePath: '/tasks/{query}',
	apiPath: '/api/tasks/{query}'
});
