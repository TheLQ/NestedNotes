import { ActiveStringMap } from "../StringMap";
import { ClientViewState } from "./ClientViewState";

export interface ClientState {
	views: ClientViewMap;
}

export type ClientViewMap = ActiveStringMap<ClientViewState>;
