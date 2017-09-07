import { Entry } from "./Entry";

export interface StringMap<T extends Entry> {
	[id: string]: T;
}

export interface ActiveStringMap<T extends Entry> {
	active: string | undefined;
	entries: StringMap<T>;
}
