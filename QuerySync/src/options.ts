export interface Options {
  pagePath: string;
  apiPath: string;
  emptyFilterRoute?: string;
}

export const DEFAULT_OPTIONS: Options = {
  pagePath: "",
  apiPath: "",
  emptyFilterRoute: "all"
};
