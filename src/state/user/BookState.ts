import { Entry } from "../Entry";
import { Tree } from "../Tree";
import { ItemState } from "./ItemState";

export interface BookState extends Entry {
	items: ItemMap;
}

export type ItemMap = Tree<ItemState>;
