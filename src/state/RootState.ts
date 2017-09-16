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
							children: ["item11"],
							text: "test item 1",
							links: [],
							tags: ["top"],
						},
						item11: {
							id: "item11",
							parent: "item1",
							children: ["item111"],
							text: "test item 11",
							links: [],
							tags: ["child"],
						},
						item111: {
							id: "item111",
							parent: "item11",
							children: [],
							text: "test item 111",
							links: [],
							tags: ["grandchild"],
						},
						item2: {
							id: "item2",
							children: [],
							text: "test item 2",
							links: [],
							tags: ["top"],
						},
					},
				},
			},
		},
		views: {
			view1: {
				id: "view1",
				forBookId: "firstbook",
			},
		},
		editors: {},
		tags: {
			entries: {
				tag1: {
					id: "tag1",
					name: "top",
				},
			},
			roots: [
				"tag1",
			],
		},
	},
	client: {
		views: {
			active: "view1",
			entries: {},
		},
	},
};
