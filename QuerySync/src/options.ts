export interface Options {
  pagePath?: string | (() => string);
  apiPath?: string | (() => string);
  noFilterString?: string;
  alphanumericOnlyRoutes?: boolean;
}

export const DEFAULT_OPTIONS: Options = {
  pagePath: "",
  apiPath: "",
  noFilterString: "all",
  alphanumericOnlyRoutes: false
};
