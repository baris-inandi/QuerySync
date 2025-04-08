export interface Options {
  pagePath: string;
  apiPath: string;
  noFilterString?: string;
}

export const DEFAULT_OPTIONS: Options = {
  pagePath: "",
  apiPath: "",
  noFilterString: "all"
};
