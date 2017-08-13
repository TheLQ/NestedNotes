import { UserState } from "./UserState";

export interface RootState {
	userData: UserState;

	// generated ui data
	activeRoots: string[];

	// ui state
	selectedTag: string | null;
	selectedItem: string | null;
}

export const initialState: RootState = {
	userData: {
		notes: {},
		tags: {},
		rootNotes: [],
	},
	activeRoots: [],
	selectedItem: null,
	selectedTag: null,
};
