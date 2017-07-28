export function indexOfOrError(haystack: any[], needle: any, errorMessage: string = "indexOf failed to find needle") {
	const result = haystack.indexOf(needle);
	if (result == -1) {
		console.log("error: needle", needle);
		console.log("error: haystack", haystack);
		throw new Error(errorMessage + " | Needle: " + needle);
	}
	return result;
}