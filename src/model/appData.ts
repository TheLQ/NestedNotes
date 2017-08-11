import { TagModel } from "./tag";
import { UserDataModel } from "./userData";

export interface AppDataModel {
	userData: UserDataModel;

	// generated ui data
	activeRoots: string[];
	selectedTag: TagModel | null;
}
