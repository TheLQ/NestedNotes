import React from "react";
import { Provider } from "react-redux";
import { createStore, Store } from "redux";

import { RootState } from "../state/RootState";
import { UserState } from "../state/user/UserState";

import { ShellComponent } from "../ui/ShellComponent";
import { initUser } from "./reducers/actions/GeneralActions";
import { selectNextActiveView, selectPrevActiveView } from "./reducers/actions/ViewActions";
import { RootReducer } from "./reducers/RootReducer";

import devToolsEnhancer from "remote-redux-devtools";

// const store = createStore(RootReducer);
const store: Store<RootState> = createStore(RootReducer, devToolsEnhancer());

export function onUserDataLoad(fileState: UserState) {
	store.dispatch(initUser(fileState));
}

export function createReact() {
	return (
		<Provider store={store}>
			 <ShellComponent />
		</Provider>
	);
}

document.addEventListener("keypress", function selectionKeyPressListener(e: KeyboardEvent) {
	// TODO: disable selection when inside edit box
	// if (Edit.insideForm()) {
	// 	return;
	// }
	if (e.charCode === "s".charCodeAt(0)) {
		store.dispatch(selectNextActiveView());
	} else if (e.charCode === "w".charCodeAt(0)) {
		store.dispatch(selectPrevActiveView());
	}
});
