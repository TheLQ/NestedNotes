import { StringMap } from "../StringMap";
import { ItemState } from "./ItemState";
import { TagState } from "./TagState";

export interface BookState {
	id: string;
	items: ItemMap;
}

export type ItemMap = StringMap<ItemState>;
export type TagMap = StringMap<TagState>;
