import { EmptyFilters } from "./filters";
import { QuerySync, QuerySyncBuilder } from "./QuerySync";

export const handleQuerySync = async <T extends EmptyFilters>(
  qsBuilder: QuerySyncBuilder<T>,
  queryString: string
): Promise<QuerySync<T>> => {
  const qs = qsBuilder();

  return await qs.applyString(queryString);
};
