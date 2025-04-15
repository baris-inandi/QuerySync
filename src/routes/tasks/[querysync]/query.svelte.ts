import { QuerySync } from '../../../lib/QuerySync.svelte';
import { TabularFilters } from '../../../lib/utils/filters';

export class TasksFilters extends TabularFilters {
	title = '';
	description = '';
	completedOnly = false;
}

export const tasksQs = new QuerySync({
	filters: TasksFilters,
	pagePath: '/tasks/{query}',
	apiPath: '/api/tasks/{query}'
});
