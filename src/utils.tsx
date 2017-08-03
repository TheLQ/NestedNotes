export function indexOfOrError(haystack: any[], needle: any, errorMessage: string = "indexOf failed to find needle") {
	const result = haystack.indexOf(needle);
	if (result == -1) {
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
