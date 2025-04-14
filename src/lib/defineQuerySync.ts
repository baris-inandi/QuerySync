import type { EmptyFilters } from "./filters.js";
import type { Options } from "./options.js";
import { QuerySync } from "./QuerySync.js";

export type QuerySyncBuilder<T extends EmptyFilters> = () => QuerySync<T>;
export function defineQuerySync<T extends EmptyFilters>(options: Options<T>): QuerySyncBuilder<T> {
  return () => new QuerySync<T>(options);
}
