import { EmptyFilters } from "./filters";
import { QuerySyncBuilder } from "./QuerySync";

export type HandleQuerySyncResult<T extends EmptyFilters> = {
  valid: boolean;
  filters: T;
  defaultFilters: T;
};

export const handleQuerySync = async <T extends EmptyFilters>(
  qsBuilder: QuerySyncBuilder<T>,
  queryString: string
): Promise<HandleQuerySyncResult<T>> => {
  const qs = qsBuilder();
  const valid = await qs.applyString(queryString);

  return {
    valid,
    filters: qs.filters,
    defaultFilters: qs.default
  };
};
