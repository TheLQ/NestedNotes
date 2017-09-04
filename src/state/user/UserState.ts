import { StringMap } from "../StringMap";
import { BookState } from "./BookState";
import { UserViewState } from "./UserViewState";

export interface UserState {
	name: string;
	books: BookMap;
	views: UserViewMap;
}

export type BookMap = StringMap<BookState>;
export type UserViewMap = StringMap<UserViewState>;
