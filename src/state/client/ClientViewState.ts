import { ActiveTree } from "../Tree";
import { ItemState } from "../user/ItemState";
import { TagState } from "../user/TagState";

export type ClientViewItems = ActiveTree<ItemState>;
export type ClientViewTags = ActiveTree<TagState>;

export interface ClientViewState {
	viewId: string;
	items: ClientViewItems;
	tags: ClientViewTags;
}
