import React from "react";

import Item from "./item2";

interface ItemProperty {
	rootNotes: string[];
	even: boolean;
}

function listComponent(props: ItemProperty): JSX.Element {
	const items = props.rootNotes.map(
		(id) => <Item id={id} even={props.even} key={id}/>,
	);
	return <ul>{items}</ul>;
}

export default listComponent;
