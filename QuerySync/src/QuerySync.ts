import baseX from "base-x";
import { compression } from "./compression";
import { type EmptyFilters } from "./filters";
import { DEFAULT_OPTIONS, Options } from "./options";
import type { JSONSerializable } from "./types/JSONSerializable";

export type QuerySyncBuilder<T extends EmptyFilters> = () => QuerySync<T>;
export function querySync<T extends EmptyFilters>(options: Options<T>): QuerySyncBuilder<T> {
  return () => new QuerySync<T>(options);
}

export class QuerySync<T extends EmptyFilters> {
  filters: T;
  default: T;
  options: Options<T>;
  private shortenerKeybindings: Record<string, string> = {};
  private expanderKeybindings: Record<string, string> = {};

  constructor(options: Options<T>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.filters = new this.options.Filters();
    this.default = new this.options.Filters();
    this.generateKeybindings();
  }

  private generateKeybindings() {
    const alphanumericBaseConverter = baseX(
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    const filters = Object.keys(this.filters);
    for (let i = 0; i < filters.length; i++) {
      const shortened = alphanumericBaseConverter.encode([i]);
      const expanded = filters[i];
      this.shortenerKeybindings[expanded] = shortened;
      this.expanderKeybindings[shortened] = expanded;
    }
  }

  async toString(): Promise<string> {
    const shortened: Record<string, any> = {};
    for (const key in this.filters) {
      if (this.default[key] === this.filters[key]) {
        continue;
      }
      const shortenedKey = this.shortenerKeybindings[key];
      if (shortenedKey) {
        shortened[shortenedKey] = this.filters[key];
      } else {
        shortened[key] = this.filters[key];
      }
    }
    if (Object.keys(shortened).length === 0) {
      return this.options.noFilterString;
    }
    return compression.compress(shortened as JSONSerializable);
  }

  async applyString(queryString: string) {
    if (queryString === this.options.noFilterString) {
      this.filters = new this.options.Filters();
      return true;
    }
    try {
      const shortened: Record<string, any> = await compression.decompress(queryString);
      const expanded: T = new this.options.Filters();
      for (const key in shortened) {
        const expandedKey = this.expanderKeybindings[key];
        if (expandedKey) {
          (expanded[expandedKey] as Record<string, any>) = shortened[key];
        }
      }
      this.filters = expanded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
