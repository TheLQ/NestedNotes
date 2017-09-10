import lodash from "lodash";

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

export function isNullOrUndefined(value: {} | null | undefined): boolean {
	return value === null || value === undefined;
}

export function indexOfSafe<T>(haystack: T[], searchElement: T, fromIndex?: number, error?: string) {
	const result = haystack.indexOf(searchElement, fromIndex);
	if (result === -1) {
		console.log("error: array", haystack);
		if (error !== undefined) {
			throw new Error(error);
		}
		const arrayStr = lodash.join(haystack);
		throw new Error(`${searchElement} not found in array ${arrayStr}`);
	}

	return result;
}
