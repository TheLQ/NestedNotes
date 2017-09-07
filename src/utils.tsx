import lodash from "lodash";

import { Entry } from "./state/Entry";
import { RootState } from "./state/RootState";
import { StringMap } from "./state/StringMap";

export function indexOfOrError(
	haystack: Array<{}>,
	needle: {},
	errorMessage: string = "indexOf failed to find needle",
) {
	const result = haystack.indexOf(needle);
	if (result === -1) {
		console.log("error: needle", needle);
		console.log("error: haystack", haystack);
		throw new Error(`${errorMessage} | Needle: ${needle}`);
	}

	return result;
}

export function deleteFrom(haystack: Array<{}>, needle: {}, deleteCount: number = 1) {
	const index = indexOfOrError(haystack, needle);
	haystack.splice(index, deleteCount);

	return index;
}

export function setError(error: string) {
	const errorBox: HTMLElement | null =  document.getElementById("error-text");
	if (errorBox !== null) {
		errorBox.appendChild(new Text(`${error}\n`));
	}
}

export function assertUnreachable(x: never): never {
	console.log("assert failed for", x);
	throw new Error("Didn't expect to get here");
}

/**
 * Copy object and apply onSingle transform to one key
 * @param map
 * @param key
 * @param onSingle
 */
export function mapSingle<V extends Entry>(
	map: StringMap<V>,
	key: string,
	onSingle: (val: V) => V,
) {
	const newMap = {...map};
	newMap[key] = onSingle(newMap[key]);

	return newMap;
}

export function getActiveView(rootState: RootState) {
	const activeView = rootState.client.views.active;
	if (activeView === undefined) {
		throw new Error("null view");
	}
	const value = rootState.client.views.entries[activeView];
	if (value === undefined) {
		console.log("views", rootState.client.views);
		throw new Error(`cannot find view '${activeView}'`);
	}

	return value;
}

export function getFirstInMap<T extends Entry>(map: StringMap<T>): T | undefined {
	for (const key in map) {
		if (!map.hasOwnProperty(key)) {
			continue;
		}

		return map[key];
	}

	return undefined;
}

export function getFirstInMapOrError<T extends Entry>(map: StringMap<T>): T {
	const result = getFirstInMap(map);
	if (result === undefined) {
		throw new Error("map empty");
	}

	return result;
}

export function isNullOrUndefined(value: {} | null | undefined): boolean {
	return value === null || value === undefined;
}

export function transformStringMap<T extends Entry>(
	entries: StringMap<T>,
	viewId: string,
	callback: (view: T) => T,
): StringMap<T> {
	return lodash.mapValues(entries, (entry) => {
		if (viewId === entry.id) {
			return callback(entry);
		}

		return entry;
	});
}

export function hasActive(value: string | undefined, name: string): value is string {
	if (value === undefined) {
		throw new Error(`active is missing for ${name}`);
	}

	return true;
}
