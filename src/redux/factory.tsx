import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { UserState } from "../state/user";

import View from "../ui/view";
import * as Actions from "./reducers/Actions";
import RootReducer from "./reducers/root";

import devToolsEnhancer from "remote-redux-devtools";

// const store = createStore(RootReducer);
const store = createStore(RootReducer, devToolsEnhancer());

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