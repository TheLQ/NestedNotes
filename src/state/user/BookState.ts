import { Tree } from "../Tree";
import { ItemState } from "./ItemState";
import { TagState } from "./TagState";

export interface BookState {
	id: string;
	items: ItemMap;
}

export type ItemMap = Tree<ItemState>;
export type TagMap = Tree<TagState>;
