import { Entry } from "../StringMap";
import { Tree } from "../Tree";
import { ItemState } from "./ItemState";

export interface BookState extends Entry {
	items: UserItemMap;
}

export type UserItemMap = Tree<ItemState>;
