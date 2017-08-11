import { ItemState } from "./item";
import { TagState } from "./tag";

export type NoteList = IdList<ItemState>;
export type TagList = IdList<TagState>;

export interface UserState {
	notes: NoteList;
	rootNotes: string[];
	tags: TagList;
}

export interface IdList<T> {
	[id: string]: T;
}
