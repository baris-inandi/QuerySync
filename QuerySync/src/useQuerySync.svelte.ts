import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import { onMount } from "svelte";
import { EmptyFilters } from "./filters";
import { QuerySyncBuilder } from "./QuerySync";

const DEBOUNCE_TIME = 250;
const TEMPLATE_STRING = "{query}";

export type UseQuerySyncResult<T extends EmptyFilters, U extends {}> = {
  filters: T;
  defaultFilters: T;
  response: { value: Promise<U> };
};

export const useQuerySync = <T extends EmptyFilters, U extends {}>(
  qsBuilder: QuerySyncBuilder<T>
): UseQuerySyncResult<T, U> => {
  const qs = qsBuilder();
  let isInitialLoad = true;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const filtersState = $state({ ...qs.filters });

  const routes = {
    resolveTemplateRoute: async (
      template: string | (() => string),
      queryString: string
    ): Promise<string> => {
      if (queryString == "") queryString = qs.options.noFilterString;
      return typeof template === "function"
        ? template()
        : template.replace(TEMPLATE_STRING, queryString);
    },
    goToPage: async (queryString: string) =>
      replaceState(await routes.resolveTemplateRoute(qs.options.pagePath, queryString), undefined),
    goToDefaultPage: async () => routes.goToPage(qs.options.noFilterString),
    resolveAPIUrl: async (queryString: string) =>
      routes.resolveTemplateRoute(qs.options.apiPath, queryString)
  };

  const fetchData = async (queryString: string): Promise<U> => {
    const url = await routes.resolveAPIUrl(queryString);
    const response = await fetch(url);
    return await response.json();
  };

  let response = $state({
    value: new Promise<U>(() => {})
  });

  const initializer = async () => {
    const initialQueryString = page.params.querysync;
    if (initialQueryString && initialQueryString != qs.options.noFilterString) {
      try {
        await qs.applyString(initialQueryString);
      } catch (error) {
        routes.goToDefaultPage();
      }
      Object.assign(filtersState, qs.filters);
    }
    isInitialLoad = false;
  };

  let onChange = () => {
    qs.filters = filtersState;
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      if (!browser || isInitialLoad) return;
      let queryString = await qs.toString();
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

  onMount(initializer);

  return {
    filters: filtersProxy,
    defaultFilters: qs.default,
    response
  };
};
