import { EmptyFilters } from "./defaultFilters.svelte.js";

export interface Options<T extends EmptyFilters> {
	filtersClass: new () => T;
	pagePath?: string | (() => string);
	apiPath?: string | (() => string);
	noFilterString?: string;
	apiFetcher?: null | ((filters: T) => Promise<any>);
	memoization?: boolean;
	debugLogs?: boolean;
}

export const DEFAULT_OPTIONS: Required<Options<EmptyFilters>> = {
	filtersClass: EmptyFilters,
	pagePath: "",
	apiPath: "",
	noFilterString: "all",
	apiFetcher: null,
	memoization: true,
	debugLogs: false
};

export const completeOptions = <T extends EmptyFilters>(options: Partial<Options<T>>): Required<Options<T>> => {
	return {
		...DEFAULT_OPTIONS,
		...options
	} as Required<Options<T>>;
};
