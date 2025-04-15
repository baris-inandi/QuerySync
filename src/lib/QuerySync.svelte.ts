import { browser } from '$app/environment';
import baseX from 'base-x';
import { compression } from './utils/compression.js';
import { DEBOUNCE_TIME } from './utils/consts';
import { type EmptyFilters } from './utils/filters.js';
import type { JSONSerializable } from './utils/JSONSerializable.js';
import { completeOptions, type Options } from './utils/options.js';
import { Routes } from './utils/routes';

export class QuerySync<T extends EmptyFilters, APIResponse extends object> {
	/* Public Properties */
	filters: T;
	defaultFilters: Readonly<T>;
	options: Required<Options<T>>;
	response = $state({ value: new Promise<APIResponse>(() => {}) });

	/* Private Properties */
	private readonly routes = new Routes(this);
	private timeoutId: ReturnType<typeof setTimeout> | null = null;
	private memo: Record<string, APIResponse> = {};
	private readonly keybindings: {
		filtersShortener: Record<string, string>;
		filtersExpander: Record<string, string>;
	} = {
		filtersShortener: {},
		filtersExpander: {}
	};

	constructor(options: Options<T>) {
		this.options = completeOptions(options);
		this.defaultFilters = new this.options.filters();
		this.filters = this.makeReactiveAndHookedFilters();
		this.generateKeybindings();
	}

	private async fetchData(): Promise<APIResponse> {
		const queryString = await this.toString();
		if (queryString in this.memo) {
			console.log(queryString + " already memo'd");
			return this.memo[queryString];
		}
		console.log('fetching...');
		if (this.options.apiFetcher) {
			const result = await this.options.apiFetcher(this.filters);
			this.memo[queryString] = result;
			return result;
		}
		const url = await this.routes.resolveAPIUrl(queryString);
		const response = await fetch(url);
		const result = await response.json();
		this.memo[queryString] = result;
		return result;
	}

	private onChange() {
		if (this.timeoutId !== null) clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(async () => {
			if (!browser) return;
			const queryString = await this.toString();
			this.routes.goToPage(queryString);
			this.response.value = this.fetchData();
			this.timeoutId = null;
		}, DEBOUNCE_TIME);
	}

	private makeReactiveAndHookedFilters(): T {
		const filtersAsObjectAsState = { ...new this.options.filters() };
		return new Proxy(filtersAsObjectAsState, {
			get: (target, prop, receiver) => {
				return Reflect.get(target, prop, receiver);
			},
			set: (target, prop, value, receiver) => {
				const oldValue = Reflect.get(target, prop, receiver);
				const result = Reflect.set(target, prop, value, receiver);
				if (oldValue !== value) {
					this.onChange();
				}
				return result;
			}
		});
	}

	private generateKeybindings() {
		const alphanumericBaseConverter = baseX(
			'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		);
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
		for (const key in this.filters) {
			if (this.defaultFilters[key] === this.filters[key]) {
				continue;
			}
			const shortenedKey = this.keybindings.filtersShortener[key];
			if (shortenedKey) {
				shortened[shortenedKey] = this.filters[key];
			} else {
				shortened[key] = this.filters[key];
			}
		}
		if (Object.keys(shortened).length === 0) {
			return this.options.noFilterString;
		}
		return compression.compress(shortened as JSONSerializable);
	}

	async applyQueryString(queryString: string): Promise<T> {
		if (queryString === this.options.noFilterString) {
			this.filters = new this.options.filters();
			return this.filters;
		}
		const shortened: Record<string, any> = await compression.decompress(queryString);
		const expanded: T = new this.options.filters();
		for (const key in shortened) {
			const expandedKey = this.keybindings.filtersExpander[key];
			if (expandedKey) {
				(expanded[expandedKey] as Record<string, any>) = shortened[key];
			}
		}
		this.filters = expanded;
		return this.filters;
	}
}
