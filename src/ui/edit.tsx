import React from "react";
import * as Config from "../config";

import * as Item from "./item";

export class Property {
    item: Item.Component;
    itemTree: Config.Item;
}

export class State {
    itemTree: Config.Item;

    textValue: string | null;
}

export class Component extends React.Component<Property, State> {
    constructor(props: Property) {
        super(props);
        this.state = {
            itemTree: props.itemTree,
            textValue: null,
        };

        // This binding is necessary to make `this` work in the callback
        this.onKey = this.onKey.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const item = this.props.itemTree;
        return (
            <textarea
                cols={50}
                rows={1}
                defaultValue={item.text}
                onKeyPress={this.onKey}
                onChange={this.handleChange}
            />
        );
    }

    handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        this.setState({ textValue: event.target.value });
    }

    onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.charCode !== 13) {
            return;
        }

        const test = this.state.textValue;
        this.setState({
            textValue: null,
        });
        this.props.item.setState((oldState: State, props: Property) => {
            props.itemTree.text = test as string;
            return {
                isTextBox: false,
            };
        });
    }
}
