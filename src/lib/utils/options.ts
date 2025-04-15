import { EmptyFilters } from './filters.js';

export interface Options<T extends EmptyFilters> {
	filters: new () => T;
	pagePath?: string | (() => string);
	apiPath?: string | (() => string);
	noFilterString?: string;
	apiFetcher?: (filters: T) => Promise<any>;
}

export const DEFAULT_OPTIONS: Options<EmptyFilters> = {
	filters: EmptyFilters,
	pagePath: '',
	apiPath: '',
	noFilterString: 'all',
	apiFetcher: undefined
};

export const completeOptions = <T extends EmptyFilters>(
	options: Partial<Options<T>>
): Required<Options<T>> => {
	return {
		...(DEFAULT_OPTIONS as Required<Options<EmptyFilters>>),
		...options
	} as Required<Options<T>>;
};
