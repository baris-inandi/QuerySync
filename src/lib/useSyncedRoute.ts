import { onMount } from 'svelte';
import type { QuerySync } from './QuerySync.svelte';
import type { EmptyFilters } from './utils/filters';
import { Routes } from './utils/routes';

export const useSyncedRoute = <T extends EmptyFilters, APIResponse extends object>(
	qs: QuerySync<T, APIResponse>,
	initialQueryString: string
) => {
	const routes = new Routes(qs);

	const _initialQueryString = initialQueryString ?? qs.options.noFilterString;

	onMount(async () => {
		if (_initialQueryString && _initialQueryString != qs.options.noFilterString) {
			try {
				await qs.applyQueryString(_initialQueryString);
			} catch (error) {
				console.error(error);
				routes.goToDefaultPage();
			}
			Object.assign(qs.filters, qs.filters);
		}
	});
};
