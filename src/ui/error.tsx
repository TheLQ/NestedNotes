import React from "react";
import * as Config from "../config";

import * as Item from "./item";

export class Property {
}

export class State {
    error: String;
}

export class Component extends React.Component<Property, State> {
    nestedComponents: Array<Item.Component> = [];

    constructor(props: Property) {
        super(props);

        this.state = {
            error: ""
        }
    }

    render(): JSX.Element {
        return (
            <h1 className={this.state.error.length == 0 ? "errorHidden" : "errorDisplayed"}>{this.state.error}</h1>
        );
    }
}

let activeComponent : Component;
export function setComponent(component: Component) {
    activeComponent = component;
}

export function setError(text: string) {
    activeComponent.setState({
        error: text
    });
}