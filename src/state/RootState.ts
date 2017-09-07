import { ClientState } from "./client/ClientState";
import { UserState } from "./user/UserState";

export interface RootState {
	user: UserState;
	client: ClientState;
}

export const initialState: RootState = {
	user: {
		name: "test",
		books: {
			firstbook: {
				id: "firstbook",
				items: {
					roots: [
						"item1",
						"item2",
					],
					entries: {
						item1: {
							id: "item1",
							childNotes: ["item11"],
							text: "test item 1",
							settings: {},
							links: [],
							tags: ["top"],
						},
						item11: {
							id: "item11",
							parent: "item1",
							childNotes: ["item111"],
							text: "test item 11",
							settings: {},
							links: [],
							tags: ["child"],
						},
						item111: {
							id: "item111",
							parent: "item11",
							childNotes: [],
							text: "test item 111",
							settings: {},
							links: [],
							tags: ["grandchild"],
						},
						item2: {
							id: "item2",
							childNotes: [],
							text: "test item 2",
							settings: {},
							links: [],
							tags: ["top"],
						},
					},
				},
			},
		},
		views: {
			view1: {
				viewId: "view1",
				forBookId: "firstbook",
			},
		},
	},
	client: {
		views: {
			active: "view1",
			entries: {},
		},
	},
};
