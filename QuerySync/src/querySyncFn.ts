import type { EmptyFilters } from "./defaultFilters.svelte";
import { QuerySync } from "./QuerySyncClass";

export const querySync = <T extends EmptyFilters>(filtersClass: new () => T) => {
  return new QuerySync(filtersClass);
};
