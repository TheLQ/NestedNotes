export interface StringMap<T> {
	[id: string]: T;
}

export interface ActiveStringMap<T> {
	active: string | undefined;
	entries: StringMap<T>;
}
