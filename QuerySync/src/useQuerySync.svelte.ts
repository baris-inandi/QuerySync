import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
import { page } from "$app/state";
import { onMount } from "svelte";
import { EmptyFilters } from "./defaultFilters.svelte";
import { DEFAULT_OPTIONS, type Options } from "./options";
import { QuerySync } from "./QuerySyncClass";

const DEBOUNCE_TIME = 200;
const TEMPLATE_STRING = "{qs}";

export const useQuerySync = <T extends EmptyFilters>(
  filtersClass: new () => T,
  options: Options
) => {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const qs = new QuerySync<T>(filtersClass);
  let filtersState = $state(qs.filters);
  let isInitialLoad = true;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  onMount(async () => {
    const initialQueryString = page.params.querysync;
    if (initialQueryString && initialQueryString != o.noFilterString) {
      try {
        await qs.fromString(initialQueryString);
        filtersState = qs.filters;
      } catch (error) {
        goToQSRoute(o.noFilterString);
        isInitialLoad = false;
      }
    }
    isInitialLoad = false;
  });

  const goToQSRoute = async (qsString: string) => {
    if (qsString == "") qsString = o.noFilterString;

    const realPath = o.pagePath.replace(TEMPLATE_STRING, qsString);
    console.log("Updating path:", realPath);
    replaceState(realPath, undefined);
  };

  let effect = async () => {
    if (!browser || isInitialLoad) return;
    let qsString = await qs.toString();
    goToQSRoute(qsString);
  };

  let onUpdate = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      effect();
      timeoutId = null;
    }, DEBOUNCE_TIME);
  };

  // We return a proxy to handle changes from the UI
  return new Proxy(qs, {
    get(target, prop, receiver) {
      if (prop === "filters") {
        onUpdate();
        return filtersState;
      }
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      if (prop === "filters") {
        filtersState = value;
        onUpdate();
        return true;
      }
      return Reflect.set(target, prop, value, receiver);
    }
  });
};
