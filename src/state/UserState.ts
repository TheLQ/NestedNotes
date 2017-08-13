import { ItemState } from "./ItemState";
import { TagState } from "./TagState";

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
