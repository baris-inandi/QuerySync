import { replaceState } from "$app/navigation";
import { TEMPLATE_STRING } from "./consts";
import type { EmptyFilters } from "./defaultFilters.svelte";
import type { Options } from "./Options";

export class Routes<T extends EmptyFilters> {
	private readonly options: Readonly<Required<Options<T>>>;

	constructor(options: Readonly<Required<Options<T>>>) {
		this.options = options;
	}

	async resolveTemplateRoute(template: string | (() => string), queryString: string): Promise<string> {
		if (queryString == "") queryString = this.options.noFilterString;
		return typeof template === "function" ? template() : template.replace(TEMPLATE_STRING, queryString);
	}

	async goToPage(queryString: string): Promise<void> {
		replaceState(await this.resolveTemplateRoute(this.options.pagePath, queryString), {});
	}

	async goToDefaultPage(): Promise<void> {
		await this.goToPage(this.options.noFilterString);
	}

	async resolveAPIUrl(queryString: string): Promise<string> {
		return this.resolveTemplateRoute(this.options.apiPath, queryString);
	}
}
