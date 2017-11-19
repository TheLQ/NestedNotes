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
	const errorText: HTMLElement | null =  document.getElementById("error-text");
	const errorBox: HTMLElement | null =  document.getElementById("error-box");
	if (errorBox !== null && errorText !== null) {
		errorBox.style.display = "block";
		errorText.appendChild(new Text(`${error}\n`));
	} else {
		alert("Error displaying error: No error-text element found?\n" + error);
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

export function deepSlowMerge<Left, Right>(left: Left, right: Right): Left & Right {
	// deep clone
	// this is likely much slower than immutable libraries but has actually seemless integration
	const cloneLeft = JSON.parse(JSON.stringify(left));

	return lodash.merge(cloneLeft, right);
}

// export function mut<V>(callback: (val: V) => void): (val: V) => V {
// 	return (val: V) => {
// 		callback(val);
// 		return val;
// 	}
// }

// Extracted from immutable-assign
// type getPropFunc<TObj, TProp, TContext> = (obj: TObj, context: TContext) => TProp;
// type setPropFunc<TProp> = (prop: TProp) => TProp;
// export function iassignState<TObj>(
// 	obj: TObj,
// 	setProp: setPropFunc<TObj>,
// 	option?: any,
// ): TObj;
// export function iassignState<TObj, TProp, TContext>(
// 	obj: TObj,
// 	getProp: getPropFunc<TObj, TProp, TContext>,
// 	setProp: setPropFunc<TProp>,
// 	context?: TContext,
// 	option?: any,
// ): TObj {
// 	deepFr
// 	return iassign(obj, getProp, setProp, context, option);
// }

export const DEFAULT_IASSIGN_OPS = {
	// freeze: true,
	// ignoreIfNoChange: true,
};
