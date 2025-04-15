import type { QuerySync } from './QuerySync.svelte';
import { Routes } from './utils/routes';

export const useQuerySync = <U extends object>(
	qs: QuerySync<any>,
	initialQueryString?: string
): { value: Promise<U> } => {
	const filtersState = $state({ ...qs.filters });
	const _initialQueryString = initialQueryString ?? qs.options.noFilterString;
	const routes = new Routes(qs);

	const fetchData = async (queryString: string): Promise<U> => {
		if (qs.options.apiFetcher) {
			return await qs.options.apiFetcher(filtersState);
		}
		const url = await routes.resolveAPIUrl(queryString);
		const response = await fetch(url);
		return await response.json();
	};
  
	const response = $state({
		value: fetchData(_initialQueryString)
	});

	qs.onChange = async () => {
		const queryString = await qs.toString();
		routes.goToPage(queryString);
		response.value = fetchData(queryString);
	};

	return response;
};
