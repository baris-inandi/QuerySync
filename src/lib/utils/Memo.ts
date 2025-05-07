import { compression } from "./compression";
import { debuglog } from "./debuglog";
import type { JSONSerializable } from "./JSONSerializable";
import type { Options } from "./Options";

export class Memo {
	private readonly storage = new Map<string, string>();

	private readonly options: Required<Options<any>>;

	constructor(options: Required<Options<any>>) {
		this.options = options;
	}

	async resolve<T>(key: string, resolver: (key: string) => Promise<T>): Promise<T> {
		if (!this.options.memoization) {
			return await resolver(key);
		}
		if (this.storage.has(key)) {
			try {
				const compressed = this.storage.get(key);
				const decompressed = await compression.decompress<T>(compressed ?? "");
				debuglog(this.options.debugLogs, `[MEMO] Returning memoized result for key ${key}`);
				return decompressed;
			} catch (e) {
				console.error(e);
				this.storage.delete(key);
				return resolver(key);
			}
		}
		debuglog(this.options.debugLogs, `[MEMO] Key not cached: ${key}`);
		const result = await resolver(key);
		this.storage.set(key, await compression.compress(result as JSONSerializable));
		return result;
	}
}
