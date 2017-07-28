import RootModel from "../model/root";

type PostReactHandler = (config: RootModel) => any;

export const KEY_ENTER = 13;

export let postReactInit: PostReactHandler[] = [];
export function onPostReactInit(config: RootModel) {
	console.log("running postreact");
	postReactInit.forEach((e) => e(config));
}
