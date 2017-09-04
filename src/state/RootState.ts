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
					item1: {
						id: "item1",
						childNotes: [],
						text: "test item 1",
						settings: {},
						links: [],
						tags: [],
					},
					item2: {
						id: "item2",
						childNotes: [],
						text: "test item 2",
						settings: {},
						links: [],
						tags: [],
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
		views: {},
		activeViewId: "view1",
	},
};
