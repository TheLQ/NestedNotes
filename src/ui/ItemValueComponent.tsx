import React from "react";

import * as AttributeComponent from "./AttributeComponent";

interface ItemValue {
	text: string;
	tags: string[];
	links: string[];
}

interface ItemValueProperty {
	item: ItemValue;
	selected: boolean;
}

export function ItemValueComponent(props: ItemValueProperty): JSX.Element {
	try {
		const tags = props.item.tags.length > 0
			? [...props.item.tags].map((curTag: string) => AttributeComponent.newTag(curTag))
			: undefined;
		const links = props.item.links.length > 0
			? [...props.item.links].map((curLink: string) => AttributeComponent.newLink(curLink))
			: undefined;
		const selected = props.selected ? "item-selected" : "item-init";

		return (
			<div className={selected}>
				{tags}{links}{props.item.text}
			</div>
		);
	} catch (error) {
		console.log("failed on item", props);
		throw error;
	}
}
