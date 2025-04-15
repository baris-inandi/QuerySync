import type { QuerySyncBuilder } from './defineQuerySync.js';
import { QuerySync } from './QuerySync.js';
import { EmptyFilters } from './utils/filters.js';

export const handleQuerySync = async <T extends EmptyFilters>(
	qsBuilder: QuerySyncBuilder<T>,
	queryString: string
): Promise<QuerySync<T>> => {
	const qs = qsBuilder();
	return await qs.applyString(queryString);
};
