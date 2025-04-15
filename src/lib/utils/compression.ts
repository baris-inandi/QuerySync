import baseX from 'base-x';
import { deflate, inflate } from 'pako';
import type { JSONSerializable } from './JSONSerializable.js';

const baseConverter = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_.');

export const compression = {
	compress: async (stringifyable: JSONSerializable): Promise<string> => {
		const input = new TextEncoder().encode(JSON.stringify(stringifyable));

		const compressed = await new Promise<Uint8Array>((resolve) => {
			Promise.resolve().then(() => {
				const result = deflate(input);
				resolve(result);
			});
		});

		return baseConverter.encode(compressed);
	},

	decompress: async <T>(encodedString: string): Promise<T> => {
		const FAIL_MSG = 'Failed to decompress query string';
		try {
			const compressed = baseConverter.decode(encodedString);
			const decompressed = await new Promise<Uint8Array>((resolve, reject) => {
				Promise.resolve().then(() => {
					try {
						const result = inflate(compressed);
						resolve(result);
					} catch (error) {
						console.error(error);
						reject(new Error(FAIL_MSG));
					}
				});
			});
			const jsonStr = new TextDecoder().decode(decompressed);
			return JSON.parse(jsonStr) as T;
		} catch (error) {
			console.error(error);
			throw new Error(FAIL_MSG);
		}
	}
};
