import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Action, applyMiddleware, createStore, Dispatch, Middleware, MiddlewareAPI, Store } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";

import { RootState } from "../state/RootState";
import { UserState } from "../state/user/UserState";
import { validate, validateUser } from "../state/Validator";
import { importUserData } from "../storage/StorageConvert";
import { StorageDriver } from "../storage/StorageDriver";
import { ShellComponent } from "../ui/ShellComponent";
import { ActionType } from "./reducers/actions/ActionType";
import { insertAbove, insertBelow, insertLeft, insertRight, newEditor } from "./reducers/actions/EditorActions";
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
				console.error("failed post validate");
				throw e;
				// throw new Error(`failed post validate ${e}`);
			}

			return result;
		};

function storageSaver(storageDriver: StorageDriver): Middleware {
	return <S extends {}>(api: MiddlewareAPI<S>) =>
		(next: Dispatch<S>) =>
			<A extends Action>(action: A) => {
				const result = next(action);

				switch (action.type) {
					case ActionType.EDITOR_SUBMIT:
					case ActionType.MOVE_UP:
					case ActionType.MOVE_DOWN:
					case ActionType.MOVE_LEFT:
					case ActionType.MOVE_RIGHT:
						storageDriver.save((api.getState() as {} as RootState).user);
						 /* falls through */
					default:
						return result;
				}
			};
}

function defaultStoreFactory(storageDriver: StorageDriver): RootStore {
	// workaround for strict ts compiler
	// tslint:disable-next-line:no-any
	const windowAny: any = window;

	const composeEnhancers = windowAny.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? windowAny.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
			// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
		})
		: composeWithDevTools({});

	return createStore(
		RootReducer,
		// deepFreeze(initialState),
		composeEnhancers(
			applyMiddleware(crashReporter, validator, storageSaver(storageDriver)),
		),
	) as RootStore;
}

export class ReduxManager {
	public readonly store: RootStore;

	public constructor(
		enableKeyboard: boolean,
		storageDriver: StorageDriver,
		storeFactory: (storageDriver: StorageDriver) => RootStore = defaultStoreFactory,
	) {
		this.store = storeFactory(storageDriver);
		if (enableKeyboard) {
			setSelectionKeyPressListener(this.store);
		}
	}

	private render() {
		return (
			<Provider store={this.store} >
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
		validateUser(fileState);
		this.store.dispatch(initUser(fileState));
	}
}

function selectionKeyPressListener(e: KeyboardEvent, store: RootStore) {
	console.log("keypress", e);

	// Do not trigger when inside a form
	// tslint:disable-next-line:no-any
	const activeElement = document.activeElement as any;
	// console.log("activeElement", document.activeElement);
	if (activeElement.form !== undefined) {
		console.log("ignoring form");

		return;
	}

	/*
	j - nav down
	k - nav up

	shift + j - nav down to sibling (skipping children)
	shift + k - nav up to sibling (skipping children)

	p - nav to parent
	t or r (In RES t=topic) - nav to root element

	alt + shift + j - nav to next root element (used inside children, seems arbitrary)
	alt + shift + k - nav to next root element (used inside children, seems arbitrary)

	w - insert above
	s - insert below
	a - insert left
	d - insert right

	shift + w - move above
	shift + s - move below
	shift + a - move left
	shift + d - move right

	// could have modes, eg pressing v enters view nav mode
	*/

	switch (e.key) {
		/* Navigation */
		// j
		case "j":
			store.dispatch(selectNextActiveView());
			break;
		// k
		case "k":
			store.dispatch(selectPrevActiveView());
			break;

		/* insert */
		// w
		case "w":
			blockCharFromNewFormElement(e);
			store.dispatch(insertAbove());
			break;
		// s
		case "s":
			blockCharFromNewFormElement(e);
			store.dispatch(insertBelow());
			break;
		// a
		case "a":
			blockCharFromNewFormElement(e);
			store.dispatch(insertLeft());
			break;
		// d
		case "d":
			blockCharFromNewFormElement(e);
			store.dispatch(insertRight());
			break;

		/* move */
		// shift + w
		case "W":
			store.dispatch(moveUp());
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

		/* tools */
		// e
		case "e":
			blockCharFromNewFormElement(e);
			store.dispatch(newEditor());
			break;
		default:
	}
}

/**
 * When pressing key creates a form element and input field gets focus, don't insert char in element
 */
function blockCharFromNewFormElement(e: KeyboardEvent) {
	e.preventDefault();
}

let activeSelectionKeyPressListener: (e: KeyboardEvent) => void | undefined;
function setSelectionKeyPressListener(store: RootStore) {
	if (activeSelectionKeyPressListener !== undefined) {
		document.removeEventListener("keydown", activeSelectionKeyPressListener);
	}

	activeSelectionKeyPressListener = (e) => selectionKeyPressListener(e, store);
	document.addEventListener("keydown", activeSelectionKeyPressListener);
}
