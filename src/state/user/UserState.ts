import { StringMap } from "../StringMap";
import { BookState } from "./BookState";
import { UserViewState } from "./UserViewState";

export interface UserState {
	books: BookMap;
	name: string;
	views: UserViewMap;
}

export type BookMap = StringMap<BookState>;
export type UserViewMap = StringMap<UserViewState>;
