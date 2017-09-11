import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Action, applyMiddleware, createStore, Dispatch, Middleware, MiddlewareAPI, Store } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";

import { initialState, RootState } from "../state/RootState";
import { UserState } from "../state/user/UserState";
import { validate } from "../state/Validator";
import { importUserData } from "../storage/StorageConvert";
import { ShellComponent } from "../ui/ShellComponent";
import { initUser } from "./reducers/actions/GeneralActions";
import {
	moveDown,
	moveLeft,
	moveRight,
	moveUp,
	selectNextActiveView,
	selectPrevActiveView,
} from "./reducers/actions/ViewActions";
import { RootReducer } from "./reducers/RootReducer";

export type RootStore = Store<RootState>;

//  extends {} is a workaround for limited generics in tsx
const crashReporter: Middleware = <S extends {}>(api: MiddlewareAPI<S>) =>
	(next: Dispatch<S>) =>
		<A extends Action>(action: A) => {
			try {
				return next(action);
			} catch (err) {
				// console.error('Caught an exception!', err)
				throw err;
			}
		};

const validator: Middleware = <S extends {}>(api: MiddlewareAPI<S>) =>
	(next: Dispatch<S>) =>
		<A extends Action>(action: A) => {
			const result = next(action);

			try {
				validate(api.getState() as {} as RootState);
			} catch (e) {
				throw new Error(`failed post validate ${e}`);
			}

			return result;
		};

function defaultStoreFactory(): RootStore {
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
		// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
	  }) || composeWithDevTools({});

	return createStore(
		RootReducer,
		composeEnhancers(
			applyMiddleware(crashReporter, validator),
		),
	) as RootStore;
}

export class ReduxManager {
	public readonly store: RootStore;

	public constructor(
		enableKeyboard: boolean,
		storeFactory: () => RootStore = defaultStoreFactory,
	) {
		this.store = storeFactory();
		if (enableKeyboard) {
			setSelectionKeyPressListener(this.store);
		}
	}

	private render() {
		return (
			<Provider store={ this.store } >
				<ShellComponent />
			</Provider>
			);
	}

	public create(element: HTMLElement) {
		if (element === null) {
			throw new Error("missing root element");
		}
		ReactDOM.render(this.render(), element);
	}

	public onUserDataLoad(fileState: UserState) {
		fileState = importUserData(fileState);
		this.store.dispatch(initUser(fileState));
	}
}

function selectionKeyPressListener(e: KeyboardEvent, store: RootStore) {
	// TODO: disable selection when inside edit box
	// if (Edit.insideForm()) {
	// 	return;
	// }
	console.log("keypress", e);
	switch (e.key) {
		// w
		case "w":
			store.dispatch(selectPrevActiveView());
			break;
		// shift + w
		case "W":
			store.dispatch(moveUp());
			break;
		// s
		case "s":
			store.dispatch(selectNextActiveView());
			break;
		// shift + s
		case "S":
			store.dispatch(moveDown());
			break;
		// shift + a
		case "A":
			store.dispatch(moveLeft());
			break;
		// shift + d
		case "D":
			store.dispatch(moveRight());
			break;
		default:
	}
}

let activeSelectionKeyPressListener: (e: KeyboardEvent) => void | undefined;
function setSelectionKeyPressListener(store: RootStore) {
	if (activeSelectionKeyPressListener !== undefined) {
		document.removeEventListener("keypress", activeSelectionKeyPressListener);
	}

	activeSelectionKeyPressListener = (e) => selectionKeyPressListener(e, store);
	document.addEventListener("keypress", activeSelectionKeyPressListener);
}
