import { Action } from "redux";

export interface ValueAction<V> extends Action {
	value: V;
}
