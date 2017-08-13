import React from "react";
import { Provider } from "react-redux";
import { createStore, Store } from "redux";

import { RootState } from "../state/root";
import { UserState } from "../state/user";

import View from "../ui/view";
import * as Actions from "./reducers/Actions";
import RootReducer from "./reducers/RootReducer";

import devToolsEnhancer from "remote-redux-devtools";

// const store = createStore(RootReducer);
const store: Store<RootState> = createStore(RootReducer, devToolsEnhancer());

export function onUserDataLoad(fileState: UserState) {
	store.dispatch(Actions.initUser(fileState));
}

export function createReact() {
	return (
		<Provider store={store}>
			 <View />
		</Provider>
	);
}

document.addEventListener("keypress", function selectionKeyPressListener(e: KeyboardEvent) {
	// TODO: disable selection when inside edit box
	// if (Edit.insideForm()) {
	// 	return;
	// }
	if (e.charCode === "s".charCodeAt(0)) {
		store.dispatch(Actions.selectedNext());
	} else if (e.charCode === "w".charCodeAt(0)) {
		store.dispatch(Actions.selectedPrev());
	}
});