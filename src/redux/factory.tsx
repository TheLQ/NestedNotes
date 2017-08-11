import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { AppDataModel } from "../model/appData";
import { UserDataModel } from "../model/userData";

import View from "../ui/view";
import * as Reducers from "./reducers";

const initData: AppDataModel = {
	userData: {
		notes: {},
		tags: {},
		rootNotes: [],
	},
	activeRoots: [],
	selectedTag: null,
};

const store = createStore(Reducers.ALL_REDUCERS, initData);

export function onUserDataLoad(fileState: UserDataModel) {
	store.dispatch(Reducers.initUserData(fileState));
}

export function createReact() {
	return (
		<Provider store={store}>
			 <View />
		</Provider>
	);
}