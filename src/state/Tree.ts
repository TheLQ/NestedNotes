import { ActiveStringMap, Entry, StringMap } from "./StringMap";

export interface Tree<T extends Entry> {
	roots: string[];
	entries: StringMap<T>;
}

export interface ActiveTree<T extends Entry> extends ActiveStringMap<T>, Tree<T> {
}
