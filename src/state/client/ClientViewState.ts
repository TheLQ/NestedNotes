import { Entry } from "../Entry";
import { ActiveTree } from "../Tree";
import { ItemState } from "../user/ItemState";
import { TagState } from "../user/TagState";

export type ClientViewItems = ActiveTree<ItemState>;
export type ClientViewTags = ActiveTree<TagState>;

export interface ClientViewState extends Entry {
	items: ClientViewItems;
	tags: ClientViewTags;
}
