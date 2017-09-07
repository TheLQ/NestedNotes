export interface StringMap<T> {
	[id: string]: T;
}

export interface ActiveStringMap<T> {
	entries: StringMap<T>;
	active: string | null;
}
