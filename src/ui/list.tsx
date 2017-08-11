import React from "react";

import Item from "./item2";

interface ListProperty {
	rootNotes: string[];
	even: boolean;
}

function listComponent(props: ListProperty): JSX.Element {
	console.log("props", props);
	const items = props.rootNotes.map(
		(id) => <Item id={id} even={props.even} key={id}/>,
	);
	return <ul>{items}</ul>;
}

export default listComponent;
