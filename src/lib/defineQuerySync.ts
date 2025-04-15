import { QuerySync } from './QuerySync.js';
import type { EmptyFilters } from './utils/filters.js';
import type { Options } from './utils/options.js';

export type QuerySyncBuilder<T extends EmptyFilters> = () => QuerySync<T>;
export function defineQuerySync<T extends EmptyFilters>(options: Options<T>): QuerySyncBuilder<T> {
	return () => new QuerySync<T>(options);
}
