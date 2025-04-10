import { version } from "../package.json";

export class EmptyFilters {
  [key: string]: any;
  __version__: string = version;
}

export class TabularFilters extends EmptyFilters {
  pageNumber: number = 1;
  itemsPerPage: number = 50;
  sortBy: string = "createdAt";
  sortOrder: "asc" | "desc" = "desc";
  fuzzySearchQuery: string = "";
  createdAtStart: string = "";
  createdAtEnd: string = "";
  updatedAtStart: string = "";
  updatedAtEnd: string = "";
}
