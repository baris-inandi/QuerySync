import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import { onMount } from "svelte";
import { EmptyFilters } from "./defaultFilters.svelte";
import { DEFAULT_OPTIONS, type Options } from "./options";
import { QuerySync } from "./QuerySyncClass";

const DEBOUNCE_TIME = 180;
const TEMPLATE_STRING = "{qs}";

export const useQuerySync = <T extends EmptyFilters>(
  filtersClass: new () => T,
  options: Options = DEFAULT_OPTIONS
): T => {
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
        goToQSRoute(o.noFilterString);
      }
    }
    isInitialLoad = false;
  };

  const goToQSRoute = async (qsString: string) => {
    if (qsString == "") qsString = o.noFilterString;

    const realPath =
      typeof o.pagePath === "function"
        ? o.pagePath()
        : o.pagePath.replace(TEMPLATE_STRING, qsString);
    replaceState(realPath, undefined);
  };

  let onUpdate = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(async () => {
      if (!browser || isInitialLoad) return;
      let qsString = await qs.toString();
      goToQSRoute(qsString);
      timeoutId = null;
    }, DEBOUNCE_TIME);
  };

  onMount(initializer);

  return new Proxy(filtersState, {
    get(target, prop, receiver) {
      onUpdate();
      qs.filters = filtersState;
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      onUpdate();
      qs.filters = filtersState;
      return Reflect.set(target, prop, value, receiver);
    }
  });
};
