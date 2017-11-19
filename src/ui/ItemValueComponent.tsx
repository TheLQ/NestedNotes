import commonmark from "commonmark";
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

const markReader = new commonmark.Parser();
const markWriter = new commonmark.HtmlRenderer();

export function ItemValueComponent(props: ItemValueProperty): JSX.Element {
	try {
		const tags = props.item.tags.length > 0
			? [...props.item.tags].map((curTag: string) => AttributeComponent.newTag(curTag))
			: undefined;
		const links = props.item.links.length > 0
			? [...props.item.links].map((curLink: string) => AttributeComponent.newLink(curLink))
			: undefined;
		const selected = props.selected ? "item-selected" : "item-init";

		const markParsed = markReader.parse(props.item.text);
		const markHtml = markWriter.render(markParsed);

		return (
			<div className={selected}>
				{tags}{links}
				<span className="renderedItem" dangerouslySetInnerHTML={{ __html: markHtml }}/>
			</div>
		);
	} catch (error) {
		console.log("failed on item", props);
		throw error;
	}
}
