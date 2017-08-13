import React from "react";

import ItemComponent from "./ItemComponent";

interface ListProperty {
	rootNotes: string[];
	even: boolean;
}

function ListComponent(props: ListProperty): JSX.Element {
	console.log("props", props);
	const items = props.rootNotes.map(
		(id) => <ItemComponent id={id} even={props.even} key={id}/>,
	);
	return <ul>{items}</ul>;
}

export default ListComponent;
