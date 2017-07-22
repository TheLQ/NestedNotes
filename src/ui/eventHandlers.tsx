import * as Config from "../config";
import * as List from "./list";

type PostReactHandler = (config: Config.Root) => any;

export const KEY_ENTER = 13;

export let postReactInit: PostReactHandler[] = [];
export function onPostReactInit(config: Config.Root) {
	console.log("running postreact");
	postReactInit.forEach((e) => e(config));
}
