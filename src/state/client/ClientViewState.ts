import { Entry } from "../StringMap";
import { ActiveTree } from "../Tree";
import { ItemState } from "../user/ItemState";
import { TagState } from "../user/TagState";

export type ClientViewItems = ActiveTree<ClientItemState>;
export type ClientViewTags = ActiveTree<TagState>;

export interface ClientViewState extends Entry {
	items: ClientViewItems;
	tags: ClientViewTags;
}

export interface ClientItemState extends ItemState {
	bookId: string;
}
