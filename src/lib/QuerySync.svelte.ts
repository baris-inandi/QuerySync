import { browser } from '$app/environment';
import baseX from 'base-x';
import { compression } from './utils/compression.js';
import { DEBOUNCE_TIME } from './utils/consts';
import { type EmptyFilters } from './utils/filters.js';
import type { JSONSerializable } from './utils/JSONSerializable.js';
import { completeOptions, type Options } from './utils/options.js';

export class QuerySync<T extends EmptyFilters> {
	filters: T;
	defaultFilters: Readonly<T>;
	options: Required<Options<T>>;
	private shortenerKeybindings: Record<string, string> = {};
	private expanderKeybindings: Record<string, string> = {};
	private timeoutId: ReturnType<typeof setTimeout> | null = null;
	onChange: () => Promise<void> = async () => {};

	constructor(options: Options<T>) {
		this.options = completeOptions(options);
		this.defaultFilters = new this.options.filters();
		this.filters = this.makeReactiveAndHookedFilters();
		this.generateKeybindings();
	}

	private hook() {
		console.log('hooked');
		if (this.timeoutId !== null) clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(async () => {
			if (!browser) return;
			this.onChange();
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
					this.hook();
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
			this.shortenerKeybindings[expanded] = shortened;
			this.expanderKeybindings[shortened] = expanded;
		}
	}

	async toString(): Promise<string> {
		const shortened: Record<string, any> = {};
		for (const key in this.filters) {
			if (this.defaultFilters[key] === this.filters[key]) {
				continue;
			}
			const shortenedKey = this.shortenerKeybindings[key];
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
			const expandedKey = this.expanderKeybindings[key];
			if (expandedKey) {
				(expanded[expandedKey] as Record<string, any>) = shortened[key];
			}
		}
		this.filters = expanded;
		return this.filters;
	}
}
