import React from "react";

import ItemComponent from "./ItemComponent";

interface ListProperty {
	viewId: string;
	rootNotes: string[];
	even: boolean;
}

export function ListComponent(props: ListProperty): JSX.Element {
	console.log("props", props);
	const items = props.rootNotes.map(
		(id) => <ItemComponent viewId={props.viewId} id={id} even={props.even} key={id}/>,
	);
	return <ul>{items}</ul>;
}

export default ListComponent;
