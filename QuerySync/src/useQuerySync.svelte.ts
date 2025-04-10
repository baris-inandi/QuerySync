import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import { onMount } from "svelte";
import { EmptyFilters } from "./defaultFilters.svelte";
import { DEFAULT_OPTIONS, type Options } from "./options";
import { QuerySync } from "./QuerySyncClass";
const DEBOUNCE_TIME = 180;
const TEMPLATE_STRING = "{query}";

export type UseQuerySyncResult<T extends EmptyFilters> = {
  filters: T;
  response: Promise<any>;
};

export const useQuerySync = <T extends EmptyFilters>(
  filtersClass: new () => T,
  options: Options = DEFAULT_OPTIONS
): UseQuerySyncResult<T> => {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const qs = new QuerySync<T>(filtersClass);
  const filtersState = $state({ ...qs.filters });

  let isInitialLoad = true;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const initializer = async () => {
    const initialQueryString = page.params.querysync;
    if (initialQueryString && initialQueryString != o.noFilterString) {
      try {
        const filters = await qs.fromString(initialQueryString);
        Object.assign(filtersState, filters);
      } catch (error) {
        routes.goToDefaultPage();
      }
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
    response: new Promise(() => {})
  };
};
