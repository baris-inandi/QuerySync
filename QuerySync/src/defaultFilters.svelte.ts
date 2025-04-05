import { version } from "../package.json";

export class EmptyFilters {
  [key: string]: any;
  __version__: string = version;
}

export class TabularFilters extends EmptyFilters {
  pageNumber: number = $state(1);
  itemsPerPage: number = $state(50);
  sortBy: string = $state("createdAt");
  sortOrder: "asc" | "desc" = $state("desc");
  fuzzySearchQuery: string = $state("");
  createdAtStart: string = $state("");
  createdAtEnd: string = $state("");
  updatedAtStart: string = $state("");
  updatedAtEnd: string = $state("");
}
