import { ItemMap, TagMap } from "../user/BookState";

export interface ClientViewState {
	viewId: string;
	items: ItemMap;
	rootItems: string[];
	tags: TagMap;
	selectedItem: string;
	selectedTag: string | null;
}