import jsonfile from "jsonfile";
import lodash from "lodash";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "remote-redux-devtools";

import {
	moveLeft,
	moveRight,
	selectNextActiveView,
	selectPrevActiveView,
} from "../src/redux/reducers/actions/ViewActions";
import { RootReducer } from "../src/redux/reducers/RootReducer";
import { ReduxManager, RootStore } from "../src/redux/ReduxManager";
import { Entry } from "../src/state/Entry";
import { ActiveStringMap } from "../src/state/StringMap";
import { UserState } from "../src/state/user/UserState";

class TestReduxManager extends ReduxManager {
	public constructor() {
		super(false, () => {
			const composeEnhancers = composeWithDevTools({
				realtime: true,
				hostname: "127.0.0.1",
				port: 8000, // the port your remotedev server is running at
			});

			return createStore(
				RootReducer,
				composeEnhancers(
					applyMiddleware(),
				),
			) as RootStore;
		});
	}
}

function reduxTest(test: (store: RootStore) => void): jest.ProvidesCallback {
	return (done) => {
		const div = document.createElement("div");
		const reduxManager = new ReduxManager(false);
		reduxManager.create(div);

		jsonfile.readFile("./dist/default.json", function(err: Error, data: UserState) {
			if (err) {
				throw err;
			}
			reduxManager.onUserDataLoad(data);
			try {
				test(reduxManager.store);
			} catch (e) {
				jsonfile.writeFile(
					"error-state.json",
					reduxManager.store.getState(),
					{spaces: 2},
					() => {
						done();
					},
				);
				// console.log("state");
				throw e;
			}
			done();
		});
	};
}

function active<T extends Entry>(map: ActiveStringMap<T>): T {
	if (map.active === undefined) {
		throw new Error("active is undefined");
	}

	const result = map.entries[map.active];
	if (result === undefined) {
		const keys = Object.keys(map.entries);
		const that = lodash.join(keys);
		throw new Error(`active ${map.active} does not exist in ${that} length ${keys.length}`);
	}

	return result;
}

function getActiveItem(store: RootStore) {
	const activeView = active(store.getState().client.views);
	const activeItem = active(activeView.items);

	return activeItem.id;
}

function expectStateDoesNotChange(store: RootStore, test: () => void) {
	const stateBefore = store.getState();
	test();
	expect(store.getState()).toEqual(stateBefore);
}

test("opens without crashing", reduxTest(() => {
	// do nothing
}));

test("select next/prev full", reduxTest((store) => {
	expect(getActiveItem(store)).toBe("item1");
	store.dispatch(selectNextActiveView());
	expect(getActiveItem(store)).toBe("item11");
	store.dispatch(selectNextActiveView());
	expect(getActiveItem(store)).toBe("item111");
	store.dispatch(selectNextActiveView());
	expect(getActiveItem(store)).toBe("item12");
	store.dispatch(selectNextActiveView());
	expect(getActiveItem(store)).toBe("item13");
	store.dispatch(selectNextActiveView());
	expect(getActiveItem(store)).toBe("item2");

	store.dispatch(selectPrevActiveView());
	expect(getActiveItem(store)).toBe("item13");
	store.dispatch(selectPrevActiveView());
	expect(getActiveItem(store)).toBe("item12");
	store.dispatch(selectPrevActiveView());
	expect(getActiveItem(store)).toBe("item111");
	store.dispatch(selectPrevActiveView());
	expect(getActiveItem(store)).toBe("item11");
	store.dispatch(selectPrevActiveView());
	expect(getActiveItem(store)).toBe("item1");
}));

describe("move inside the tree", () => {
	test("right", reduxTest((store) => {
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		expect(getActiveItem(store)).toBe("item13");

		store.dispatch(moveRight());
		// expect(store.getState()).toMatchSnapshot();

		expectStateDoesNotChange(store, () => {
			store.dispatch(moveRight());
		});
	}));
	test("right at end does nothing", reduxTest((store) => {
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		expect(getActiveItem(store)).toBe("item111");

		expectStateDoesNotChange(store, () => {
			store.dispatch(moveRight());
		});
	}));
	test("left", reduxTest((store) => {
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		expect(getActiveItem(store)).toBe("item111");

		store.dispatch(moveLeft());
		// expect(store.getState()).toMatchSnapshot();
	}));
});

describe("move at root", () => {
	test.only("left to roots", reduxTest((store) => {
		store.dispatch(selectNextActiveView());
		expect(getActiveItem(store)).toBe("item11");

		store.dispatch(moveLeft());
		// expect(store.getState()).toMatchSnapshot();
	}));
	test.only("right to inside", reduxTest((store) => {
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		store.dispatch(selectNextActiveView());
		expect(getActiveItem(store)).toBe("item2");

		store.dispatch(moveRight());
		// expect(store.getState()).toMatchSnapshot();
	}));
});
