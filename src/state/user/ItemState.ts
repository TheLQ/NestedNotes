import lodash from "lodash";

import { isNullOrUndefined } from "../../utils";
import { Entry } from "../StringMap";

export interface ItemState extends Entry {
	parent?: string;
	children: string[];
	text: string;
	name?: string;
	links: string[];
	tags: string[];
}

/**
 * Init all null values
 * @param item
 * @param rootItemIds roots of item tree
 */
export function fillItemDefault(item: ItemState, rootItemIds: string[]): void {
	if (item.id === "undefined") {
		console.log("Invalid item: Missing id. ", item);
		throw new Error(`Invalid item: Missing id. ${item.id}`);
	}
	if (isNullOrUndefined(item.parent)) {
		if (rootItemIds.indexOf(item.id) === -1) {
			console.log(`Item ${item.id} for error:`, item);
			const roots = lodash.join(rootItemIds);
			throw new Error(`Invalid item ${item.id}: No parent and not in roots ${roots}`);
		}
	} else {
		if (rootItemIds.indexOf(item.id) !== -1) {
			console.log("Invalid item: Illegal state, has parent and in rootNotes. ", item);
			throw new Error(`Invalid item: Illegal state, has parent and in rootNotes. ${item.id}`);
		}
	}

	if (isNullOrUndefined(item.children)) {
		item.children = [];
	}
	if (isNullOrUndefined(item.text)) {
		console.log("Invalid item: Missing text. ", item);
		throw new Error(`Invalid item: Missing text. ${item}`);
	}
	if (isNullOrUndefined(item.name)) {
		item.name = "";
	}
	if (isNullOrUndefined(item.links)) {
		item.links = [];
	}
	if (isNullOrUndefined(item.tags)) {
		item.tags = [];
	}
}
