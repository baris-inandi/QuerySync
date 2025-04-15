import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';
import { onMount } from 'svelte';
import type { QuerySyncBuilder } from './defineQuerySync.js';
import { DEBOUNCE_TIME, TEMPLATE_STRING } from './utils/consts';
import type { EmptyFilters } from './utils/filters';

export type UseQuerySyncResult<T extends EmptyFilters, U extends object> = {
	filters: T;
	defaultFilters: T;
	response: { value: Promise<U> };
};

export const useQuerySync = <T extends EmptyFilters, U extends object>(
	qsBuilder: QuerySyncBuilder<T>,
	initialQueryString?: string
): UseQuerySyncResult<T, U> => {
	const qs = qsBuilder();
	let isInitialLoad = true;
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	const filtersState = $state({ ...qs.filters });
	const _initialQueryString = initialQueryString ?? qs.options.noFilterString;

	const routes = {
		resolveTemplateRoute: async (
			template: string | (() => string),
			queryString: string
		): Promise<string> => {
			if (queryString == '') queryString = qs.options.noFilterString;
			return typeof template === 'function'
				? template()
				: template.replace(TEMPLATE_STRING, queryString);
		},
		goToPage: async (queryString: string) =>
			replaceState(await routes.resolveTemplateRoute(qs.options.pagePath, queryString), {}),
		goToDefaultPage: async () => routes.goToPage(qs.options.noFilterString),
		resolveAPIUrl: async (queryString: string) =>
			routes.resolveTemplateRoute(qs.options.apiPath, queryString)
	};

	const fetchData = async (queryString: string): Promise<U> => {
		if (qs.options.apiFetcher) {
			return await qs.options.apiFetcher(filtersState);
		}
		const url = await routes.resolveAPIUrl(queryString);
		const response = await fetch(url);
		return await response.json();
	};

	const response = $state({
		value: new Promise<U>(() => {})
	});

	const onChange = () => {
		qs.filters = filtersState;
		if (timeoutId !== null) clearTimeout(timeoutId);
		timeoutId = setTimeout(async () => {
			if (!browser || isInitialLoad) return;
			const queryString = await qs.toString();
			routes.goToPage(queryString);
			response.value = fetchData(queryString);
			timeoutId = null;
		}, DEBOUNCE_TIME);
	};

	const filtersProxy = new Proxy(filtersState, {
		get(target, prop, receiver) {
			onChange();
			return Reflect.get(target, prop, receiver);
		},
		set(target, prop, value, receiver) {
			onChange();
			return Reflect.set(target, prop, value, receiver);
		}
	});

	onMount(async () => {
		if (_initialQueryString && _initialQueryString != qs.options.noFilterString) {
			try {
				await qs.applyString(_initialQueryString);
			} catch (error) {
				console.error(error);
				routes.goToDefaultPage();
			}
			Object.assign(filtersState, qs.filters);
		}
		isInitialLoad = false;
	});

	return {
		filters: filtersProxy,
		defaultFilters: qs.default,
		response
	};
};
