import React from "react";
import * as Config from "../config";

import * as Item from "./item";

export class Property {
	list: Config.Item[];
	even: boolean;
}

export class State {

}

export class Component extends React.Component<Property, State> {
	nestedComponents: Item.Component[] = [];
	private refHandlers = {
		item: () => this.nestedComponents = ref,
	};

	constructor(props: Property) {
		super(props);
	}

	render(): JSX.Element {
		const list = this.props.list;
		// console.log("list", list);

		const itemComponents = list.map((nestedItem, index) => (
			<Item.Component
				key={nestedItem.id}
				itemTree={nestedItem}
				even={this.props.even}
				 ref={(input) => { if (input != null) { this.nestedComponents[index] = input } }}
			/>
		));
		return (
			<ul className="generic">
				{itemComponents}
			</ul>
		);
	}
}
