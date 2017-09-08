import React from "react";
import { Provider } from "react-redux";
import { createStore, Store } from "redux";

import { RootState } from "../state/RootState";
import { UserState } from "../state/user/UserState";

import { ShellComponent } from "../ui/ShellComponent";
import { initUser } from "./reducers/actions/GeneralActions";
import { moveDown, moveUp, selectNextActiveView, selectPrevActiveView } from "./reducers/actions/ViewActions";
import { RootReducer } from "./reducers/RootReducer";

// const store = createStore(RootReducer);
const store: Store<RootState> = createStore(
	RootReducer,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

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
	console.log("keypress", e);
	switch (e.key) {
		case "w":
			store.dispatch(selectPrevActiveView());
			break;
		case "W":
			store.dispatch(moveUp());
			break;
		case "s":
			store.dispatch(selectNextActiveView());
			break;
		case "S":
			store.dispatch(moveDown());
			break;
		default:
	}
});
