import { EmptyFilters } from "./filters";

export interface Options<T extends EmptyFilters> {
  filters: new () => T;
  pagePath?: string | (() => string);
  apiPath?: string | (() => string);
  noFilterString?: string;
  apiFetcher?: (filters: T) => Promise<any>;
}

export const DEFAULT_OPTIONS: Options<EmptyFilters> = {
  pagePath: "",
  apiPath: "",
  noFilterString: "all",
  filters: EmptyFilters,
  apiFetcher: undefined
};
