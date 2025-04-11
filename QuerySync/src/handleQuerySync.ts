import { page } from "$app/state";
import { EmptyFilters } from "./filters";
import { QuerySyncBuilder } from "./QuerySync";

export type HandleQuerySyncResult<T extends EmptyFilters> = {
  valid: boolean;
  filters: T;
  defaultFilters: T;
};

export const handleQuerySync = async <T extends EmptyFilters>(
  qsBuilder: QuerySyncBuilder<T>
): Promise<HandleQuerySyncResult<T>> => {
  const qs = qsBuilder();
  const valid = await qs.applyString(page.params.querysync);

  return {
    valid,
    filters: qs.filters,
    defaultFilters: qs.default
  };
};
