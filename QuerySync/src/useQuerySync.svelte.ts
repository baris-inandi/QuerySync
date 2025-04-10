import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import { onMount } from "svelte";
import { EmptyFilters } from "./filters";
import { DEFAULT_OPTIONS, type Options } from "./options";
import { QuerySync } from "./QuerySync";

const DEBOUNCE_TIME = 250;
const TEMPLATE_STRING = "{query}";

export type UseQuerySyncResult<T extends EmptyFilters, U extends {}> = {
  filters: T;
  response: Promise<U>;
};

export const useQuerySync = <T extends EmptyFilters, U extends {}>(
  options: Options<T>
): UseQuerySyncResult<T, U> => {
  const o: Options<T> = { ...DEFAULT_OPTIONS, ...options };
  let isInitialLoad = true;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const qs = new QuerySync<T>(o);
  const filtersState = $state({ ...qs.filters });
  let response: Promise<Awaited<U>> = Promise.resolve({} as Awaited<U>);

  const fetchData = async (qsString: string): Promise<Awaited<U>> => {
    const apiUrl = await routes.resolveAPIUrl(qsString);
    return fetch(apiUrl).then((res) => res.json());
  };

  const initializer = async () => {
    const initialQueryString = page.params.querysync;
    if (initialQueryString && initialQueryString != o.noFilterString) {
      const success = await qs.applyString(initialQueryString);
      if (!success) {
        routes.goToDefaultPage();
      }
      Object.assign(filtersState, qs.filters);
      response = fetchData(initialQueryString);
    }
    isInitialLoad = false;
  };

  const routes = {
    resolveTemplateRoute: async (
      template: string | (() => string),
      qsString: string
    ): Promise<string> => {
      if (qsString == "") qsString = o.noFilterString;
      return typeof template === "function"
        ? template()
        : template.replace(TEMPLATE_STRING, qsString);
    },
    goToPage: async (qsString: string) =>
      replaceState(await routes.resolveTemplateRoute(o.pagePath, qsString), undefined),
    goToDefaultPage: async () => routes.goToPage(o.noFilterString),
    resolveAPIUrl: async (qsString: string) => routes.resolveTemplateRoute(o.apiPath, qsString)
  };

  let onChange = () => {
    qs.filters = filtersState;
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      if (!browser || isInitialLoad) return;
      let qsString = await qs.toString();
      routes.goToPage(qsString);
      timeoutId = null;
      response = fetchData(qsString);
    }, DEBOUNCE_TIME);
  };

  const proxy = new Proxy(filtersState, {
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
    filters: proxy,
    response
  };
};
