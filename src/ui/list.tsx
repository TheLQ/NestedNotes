import React from "react";
import * as Config from "../config";

import * as Item from "./item";

export class Property {
    list: Config.Item[];
}

export class State {
}

export class Component extends React.Component<Property, State> {
    nestedComponents: Array<React.ReactElement<Item.Component>>;

    constructor(props: Property) {
        super(props);
    }

    render(): JSX.Element {
        const list = this.props.list;
        console.log("list", list);

        this.nestedComponents = list.map((nestedItem) =>
            <Item.Component key={nestedItem.id} itemTree={nestedItem} />,
        );
        return (
            <ul>
                {this.nestedComponents}
            </ul>
        );
    }
}
