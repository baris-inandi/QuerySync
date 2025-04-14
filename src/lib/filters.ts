export class EmptyFilters {
  [key: string]: any;
  __encoding__: number = 1;
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
