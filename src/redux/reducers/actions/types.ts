import { Action } from "redux";

export interface EntryAction extends Action {
	entryId: string;
}

export interface ValueEntryAction<V> extends EntryAction {
	value: V;
}

export interface ItemAction extends Action {
	id: string;
}
