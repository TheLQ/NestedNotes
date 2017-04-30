import * as List from "./list";

export let postReactInit: Array<(e: List.Component) => any> = [];
export function onPostReactInit(event: List.Component) {
    const self: any = this;
    postReactInit.forEach((e) => e.apply(self, event));
}
