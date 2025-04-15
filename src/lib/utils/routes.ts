import { replaceState } from '$app/navigation';
import type { QuerySync } from '../QuerySync';
import { TEMPLATE_STRING } from './consts';
import type { EmptyFilters } from './filters';

export class Routes<T extends EmptyFilters> {
	private readonly qs: QuerySync<T>;

	constructor(qs: QuerySync<T>) {
		this.qs = qs;
	}

	async resolveTemplateRoute(
		template: string | (() => string),
		queryString: string
	): Promise<string> {
		if (queryString == '') queryString = this.qs.options.noFilterString;
		return typeof template === 'function'
			? template()
			: template.replace(TEMPLATE_STRING, queryString);
	}

	async goToPage(queryString: string): Promise<void> {
		replaceState(await this.resolveTemplateRoute(this.qs.options.pagePath, queryString), {});
	}

	async goToDefaultPage(): Promise<void> {
		await this.goToPage(this.qs.options.noFilterString);
	}

	async resolveAPIUrl(queryString: string): Promise<string> {
		return this.resolveTemplateRoute(this.qs.options.apiPath, queryString);
	}
}
