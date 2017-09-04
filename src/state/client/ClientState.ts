import { StringMap } from "../StringMap";
import { ClientViewState } from "./ClientViewState";

export interface ClientState {
	views: ClientViewMap;
	activeViewId: string;
}

export type ClientViewMap = StringMap<ClientViewState>;
