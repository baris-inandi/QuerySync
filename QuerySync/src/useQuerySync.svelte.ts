import { goto } from "$app/navigation";
import { EmptyFilters } from "./defaultFilters.svelte";
import { DEFAULT_OPTIONS, type Options } from "./options";
import { QuerySync } from "./QuerySyncClass";

export const useQuerySync = <T extends EmptyFilters>(filters: new () => T, options: Options) => {
  const o = { ...DEFAULT_OPTIONS, ...options };
  const hq = new QuerySync(filters);

  $effect(() => {
    (async () => {
      const str = await hq.toString();
      const realURL = o.path.replace("{qs}", str);
      goto(realURL);
    })();
  });

  return hq;
};
