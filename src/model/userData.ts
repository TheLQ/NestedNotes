import { ItemModel } from "./item";
import { TagModel } from "./tag";

export interface UserDataModel {
	notes: IdList<ItemModel>;
	rootNotes: string[];
	tags: IdList<TagModel>;
}

export interface IdList<T> {
	[id: string]: T;
}
