import { browser } from "$app/environment";
import baseX from "base-x";
import { compression } from "./utils/compression.js";
import { debuglog } from "./utils/debuglog";
import { type EmptyFilters } from "./utils/defaultFilters.svelte.js";
import type { JSONSerializable } from "./utils/JSONSerializable.js";
import { Memo } from "./utils/Memo";
import { completeOptions, type Options } from "./utils/Options.js";
import { Routes } from "./utils/Routes.js";

export class QuerySync<T extends EmptyFilters, APIResponse extends object> {
	/* Public Properties */
	readonly defaultFilters: Readonly<T>;
	readonly options: Readonly<Required<Options<T>>>;

	/* Private Properties */
	private readonly _response = $state({ value: new Promise<APIResponse>(() => {}) });
	private readonly _filters = $state({ value: {} } as { value: T });
	private readonly routes: Routes<T>;
	private readonly memo: Memo;
	private readonly keybindings: {
		filtersShortener: Record<string, string>;
		filtersExpander: Record<string, string>;
	} = {
		filtersShortener: {},
		filtersExpander: {}
	};

	get response() {
		return this._response.value;
	}

	get filters() {
		return this._filters.value;
	}

	set filters(value: T) {
		this._filters.value = value;
	}

	constructor(options: Options<T>) {
		this.options = completeOptions(options);
		this.defaultFilters = new this.options.filtersClass();
		this.filters = new this.options.filtersClass();
		this.generateKeybindings();
		this.routes = new Routes(this.options);
		this.memo = new Memo(this.options);
		debuglog(this.options.debugLogs, "QuerySync instantiated.");
	}

	private async fetchData(): Promise<APIResponse> {
		return this.memo.runOrGet(await this.toString(), async (queryString) => {
			debuglog(this.options.debugLogs, `Fetching from API: '${queryString}'`);
			if (this.options.apiFetcher) {
				debuglog(this.options.debugLogs, `Using custom apiFetcher function for '${queryString}'`);
				return await this.options.apiFetcher(this.filters);
			}
			const url = await this.routes.resolveAPIUrl(queryString);
			const response = await fetch(url);
			const result = await response.json();
			return result;
		});
	}

	commit() {
		return async (e: Event = new Event("submit")) => {
			e.preventDefault();
			if (!browser) {
				return;
			}
			const queryString = await this.toString();
			await this.routes.goToPage(queryString);
			this._response.value = this.fetchData();
		};
	}

	private generateKeybindings() {
		const alphanumericBaseConverter = baseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
		const filters = Object.keys(this.filters);
		for (let i = 0; i < filters.length; i++) {
			const shortened = alphanumericBaseConverter.encode([i]);
			const expanded = filters[i];
			this.keybindings.filtersShortener[expanded] = shortened;
			this.keybindings.filtersExpander[shortened] = expanded;
		}
	}

	async toString(): Promise<string> {
		const shortened: Record<string, any> = {};
		const filtersSnapshot = $state.snapshot(this.filters) as T;
		for (const key in filtersSnapshot) {
			if (this.defaultFilters[key] === filtersSnapshot[key]) {
				continue;
			}
			const shortenedKey = this.keybindings.filtersShortener[key];
			if (shortenedKey) {
				shortened[shortenedKey] = filtersSnapshot[key];
			} else {
				shortened[key] = filtersSnapshot[key];
			}
		}
		if (Object.keys(shortened).length === 0) {
			return this.options.noFilterString;
		}
		return compression.compress(shortened as JSONSerializable);
	}

	async applyQueryString(queryString: string): Promise<T> {
		if (queryString === this.options.noFilterString) {
			this.filters = new this.options.filtersClass();
			return this.filters;
		}

		const shortened: Record<string, any> = await compression.decompress(queryString);
		const expanded: T = new this.options.filtersClass();
		for (const key in shortened) {
			const expandedKey = this.keybindings.filtersExpander[key];
			if (expandedKey) {
				(expanded[expandedKey] as Record<string, any>) = shortened[key];
			}
		}
		this.filters = expanded;
		return this.filters;
	}

	onMount(initialQueryString: string) {
		return () => {
			(async () => {
				await this.applyQueryString(initialQueryString);
				this.commit()();
			})();
		};
	}
}
