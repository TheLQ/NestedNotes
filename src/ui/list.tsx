import React from "react";
import * as Config from "../config";

import * as Item from "./item";

export class Property {
    list: Config.Item[];
}

export class State {
}

export class Component extends React.Component<Property, State> {
    nestedComponents: Array<Item.Component> = [];

    constructor(props: Property) {
        super(props);
    }

    render(): JSX.Element {
        const list = this.props.list;
        console.log("list", list);

        let itemComponents = list.map((nestedItem, index) =>
            <Item.Component
                key={nestedItem.id}
                itemTree={nestedItem}
                ref={(input) => {this.nestedComponents[index] = input} }
            />,
        );
        return (
            <ul>
                {itemComponents}
            </ul>
        );
    }
}
