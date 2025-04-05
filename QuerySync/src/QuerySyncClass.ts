import baseX from "base-x";
import { compression } from "./compression";
import { type EmptyFilters } from "./defaultFilters.svelte";
import type { JSONSerializable } from "./types/JSONSerializable";

const alphanumericBaseConverter = baseX(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
);

export class QuerySync<T extends EmptyFilters> {
  filters: T;
  default: T;
  filtersClass: new () => T;
  private shortenerKeybindings: Record<string, string> = {};
  private expanderKeybindings: Record<string, string> = {};

  constructor(filtersClass: new () => T) {
    this.filtersClass = filtersClass;
    this.filters = new filtersClass();
    this.default = new filtersClass();
    this.generateKeybindings();
  }

  private generateKeybindings() {
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
      return "";
    }
    return compression.compress(shortened as JSONSerializable);
  }

  async fromString(query: string): Promise<T> {
    const shortened: Record<string, any> = await compression.decompress(query);
    const expanded: T = new this.filtersClass();
    for (const key in shortened) {
      const expandedKey = this.expanderKeybindings[key];
      if (expandedKey) {
        (expanded[expandedKey] as Record<string, any>) = shortened[key];
      }
    }
    return expanded;
  }
}
