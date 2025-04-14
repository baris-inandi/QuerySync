import baseX from "base-x";
import { compression } from "./compression.js";
import { type EmptyFilters } from "./filters.js";
import type { JSONSerializable } from "./JSONSerializable.js";
import { completeOptions, type Options } from "./options.js";

export class QuerySync<T extends EmptyFilters> {
  filters: T;
  default: Readonly<T>;
  options: Required<Options<T>>;
  private shortenerKeybindings: Record<string, string> = {};
  private expanderKeybindings: Record<string, string> = {};

  constructor(options: Options<T>) {
    this.options = completeOptions(options);
    this.filters = new this.options.filters();
    this.default = new this.options.filters();
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
      this.filters = new this.options.filters();
      return this;
    }
    const shortened: Record<string, any> = await compression.decompress(queryString);
    const expanded: T = new this.options.filters();
    for (const key in shortened) {
      const expandedKey = this.expanderKeybindings[key];
      if (expandedKey) {
        (expanded[expandedKey] as Record<string, any>) = shortened[key];
      }
    }
    this.filters = expanded;
    return this;
  }
}
