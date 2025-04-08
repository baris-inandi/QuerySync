import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";
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

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  let effect = async () => {
    if (!browser) return;

    (async () => {
      let qsString = await qs.toString();
      if (qsString == "") qsString = o.emptyFilterRoute;
      const realPath = o.pagePath.replace(TEMPLATE_STRING, qsString);
      console.log(realPath);
      replaceState(realPath, undefined);
    })();
  };

  let onUpdate = () => {
    if (timeoutId !== null) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      effect();
      timeoutId = null;
    }, DEBOUNCE_TIME);
  };

  const proxy = new Proxy(qs, {
    get(target, prop, receiver) {
      if (prop === "filters") onUpdate();
      return Reflect.get(target, prop, receiver);
    },
    set(target, prop, value, receiver) {
      if (prop === "filters") onUpdate();
      return Reflect.set(target, prop, value, receiver);
    }
  });

  return proxy;
};
