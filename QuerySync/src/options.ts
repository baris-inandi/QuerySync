import { EmptyFilters } from "./filters";

export interface Options<T extends EmptyFilters> {
  Filters: new () => T;
  pagePath?: string | (() => string);
  apiPath?: string | (() => string);
  noFilterString?: string;
  alphanumericOnlyRoutes?: boolean;
}

export const DEFAULT_OPTIONS: Options<EmptyFilters> = {
  pagePath: "",
  apiPath: "",
  noFilterString: "all",
  alphanumericOnlyRoutes: false,
  Filters: EmptyFilters
};
