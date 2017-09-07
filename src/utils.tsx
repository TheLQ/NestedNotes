import { RootState } from "./state/RootState";
import { StringMap } from "./state/StringMap";

export function indexOfOrError(haystack: any[], needle: any, errorMessage: string = "indexOf failed to find needle") {
	const result = haystack.indexOf(needle);
	if (result === -1) {
		console.log("error: needle", needle);
		console.log("error: haystack", haystack);
		throw new Error(errorMessage + " | Needle: " + needle);
	}
	return result;
}

export function deleteFrom(haystack: any[], needle: any, deleteCount: number = 1) {
	const index = indexOfOrError(haystack, needle);
	haystack.splice(index, deleteCount);
	return index;
}

export function setError(error: string) {
	const errorBox: HTMLElement | null =  document.getElementById("error-text");
	if (errorBox != null) {
		errorBox.appendChild(new Text(error + "\n"));
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
export function mapSingle<V>(
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
	if (activeView == null) {
		throw new Error("null view");
	}
	const value = rootState.client.views.entries[activeView];
	if (value === undefined) {
		console.log("views", rootState.client.views);
		throw new Error(`cannot find view '${activeView}'`);
	}
	return value;
}

export function getFirstInMap<T>(map: StringMap<T>): T | null {
	for (const key in map) {
		if (!map.hasOwnProperty(key)) {
			continue;
		}
		return map[key];
	}
	return null;
}

export function getFirstInMapOrError<T>(map: StringMap<T>): T {
	const result = getFirstInMap(map);
	if (result == null) {
		throw new Error("map empty");
	}
	return result;
}
