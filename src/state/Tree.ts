import { ActiveStringMap, StringMap } from "./StringMap";

export interface Tree<T> {
	roots: string[];
	entries: StringMap<T>;
}

export interface ActiveTree<T> extends ActiveStringMap<T>, Tree<T> {
}
