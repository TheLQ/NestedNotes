import { StringMap } from "../StringMap";
import { Tree } from "../Tree";
import { BookState } from "./BookState";
import { EditorState } from "./EditorState";
import { TagState } from "./TagState";
import { UserViewState } from "./UserViewState";

export interface UserState {
	name: string;
	prod: boolean;
	books: BookMap;
	tags: UserTagMap;
	views: UserViewMap;
	editors: EditorMap;
}

export type BookMap = StringMap<BookState>;
export type UserViewMap = StringMap<UserViewState>;
export type UserTagMap = Tree<TagState>;
export type EditorMap = StringMap<EditorState>;
