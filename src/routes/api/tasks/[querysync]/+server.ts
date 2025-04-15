import { json } from '@sveltejs/kit';
import { tasksQs } from '../../../tasks/[querysync]/tasksQs';
import { getDummyTasks } from './dummy.js';

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
		const filters = await tasksQs.applyQueryString(params.querysync);
		return json(getDummyTasks(filters), { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Invalid or malformed query string' }, { status: 400 });
	}
}
