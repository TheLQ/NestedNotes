import * as List from "./list";
import * as Config from "../config";

type PostReactHandler = (config: Config.Root) => any;

export const KEY_ENTER = 13;

export let postReactInit: Array<PostReactHandler> = [];
export function onPostReactInit(config: Config.Root) {
    console.log("running postreact");
    postReactInit.forEach((e) => e(config));
}
