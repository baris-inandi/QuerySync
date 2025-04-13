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
      qsString: string
    ): Promise<string> => {
      if (qsString == "") qsString = qs.options.noFilterString;
      return typeof template === "function"
        ? template()
        : template.replace(TEMPLATE_STRING, qsString);
    },
    goToPage: async (qsString: string) =>
      replaceState(await routes.resolveTemplateRoute(qs.options.pagePath, qsString), undefined),
    goToDefaultPage: async () => routes.goToPage(qs.options.noFilterString),
    resolveAPIUrl: async (qsString: string) =>
      routes.resolveTemplateRoute(qs.options.apiPath, qsString)
  };

  const fetchData = async (qsString: string): Promise<U> => {
    const url = await routes.resolveAPIUrl(qsString);
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
      let qsString = await qs.toString();
      routes.goToPage(qsString);
      response.value = fetchData(qsString);
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
