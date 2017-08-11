import { TagState } from "./tag";
import { UserState } from "./user";

export interface RootState {
	userData: UserState;

	// generated ui data
	activeRoots: string[];
	selectedTag: TagState | null;
}

export const initialState: RootState = {
	userData: {
		notes: {},
		tags: {},
		rootNotes: [],
	},
	activeRoots: [],
	selectedTag: null,
};
