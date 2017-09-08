import { UserState } from "../state/user/UserState";

export interface StorageDriver {
	load(callback: (userState: UserState) => void): void;
	save(userState: UserState, callback?: () => void): void;
}
