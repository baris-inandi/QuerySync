import type { QuerySyncBuilder } from "./defineQuerySync.js";
import { EmptyFilters } from "./filters.js";
import { QuerySync } from "./QuerySync.js";

export const handleQuerySync = async <T extends EmptyFilters>(
  qsBuilder: QuerySyncBuilder<T>,
  queryString: string
): Promise<QuerySync<T>> => {
  const qs = qsBuilder();
  return await qs.applyString(queryString);
};
