import React from "react";
import * as Config from "../config";

import * as Edit from "./edit";
import * as EventHandler from "./eventHandlers";
import * as Item from "./item";
import * as List from "./list";

export class Property {
    itemTree: Config.Item;
}

export class State {
    isTextBox: boolean;
    isSelected: boolean;
}

export class Component extends React.Component<Property, State> {
    constructor(props: Property) {
        super(props);
        this.state = {
            isSelected: false,
            isTextBox: false,
        };

        // This binding is necessary to make `this` work in the callback
        this.onEditItem = this.onEditItem.bind(this);
    }

    render() {
        console.log("item", this.state);
        const item = this.props.itemTree;

        const text = this.state.isTextBox
            ? <Edit.Component itemTree={this.props.itemTree} item={this} />
            : item.text;

        const nestedList = item.nested !== undefined
            ? <List.Component list={item.nested} />
            : null;

        return (
            <li
                onClick={this.onEditItem}
                className={this.state.isSelected ? "item-selected" : "item-init"}
            >
                {text}
                {nestedList}
            </li >
        );

    }

    onEditItem(e: React.MouseEvent<HTMLLIElement>) {
        console.log("onEditItem");
        e.preventDefault();
        e.stopPropagation();

        if (this.state.isTextBox) {
            // sucesfully stopped propagation
            return;
        }

        this.setState((prevState, props) => ({
            isTextBox: true,
        }));
    }
}

/** selection */

let selectedItem: Component | null = null;

EventHandler.postReactInit.push(function getFirstItem(root: List.Component) {
    console.log("ysy");
    // todo
    // React.Children.forEach((curNode: React.ReactElement<List.ListProperty>) => {
    // });

    // root.props.children[0]
    // const test = root.nestedComponents[0] as Item.Component;
});

function updateSelection(newSelection: Component) {
    // skip during init
    if (selectedItem != null) {
        selectedItem.setState({
            isSelected: false,
        });
    }
    newSelection.setState({
        isSelected: true,
    });
    selectedItem = newSelection;
}

const SELECTION_STOP = 0;

enum SelectionState {
    Enabled,
    Trigger,
    Done,
}

function selectionNext() {
    if (!selectedItem) {
        throw new Error("selection before run");
    }
    const item = selectedItem.props.itemTree;

    let result: Config.Item | null;
    let trigger = false;
    iterate(function selectionPump(currentItem: Config.Item): boolean {
        if (result === currentItem) {
            trigger = true;
            return true;
        } else if (!trigger) {
            return true;
        }

        result = currentItem;
        return false;
    });
}

function selectionPrev() {
    if (!selectedItem) {
        throw new Error("selection before run");
    }
    const item = selectedItem.props.itemTree;

    let result: Config.Item | null;
    let trigger = false;
    iterate(function selectionPump(currentItem: Config.Item): boolean {
        if (result === currentItem) {
            trigger = true;
        } else if (!trigger) {
            result = currentItem;
            return true;
        }

        return false;
    });
}

type Iterator = (currentItem: Config.Item) => boolean;

function iterate(test: Iterator) {
    Config.activeConfig.notes.forEach(function iteratePump(element) {
        let lastIndex = 0;
        while (true) {
            lastIndex = _iterateNext([element], lastIndex, test);
            if (lastIndex < 0) {
                break;
            }
        }
    });
}

function _iterateNext(stack: Config.Item[], nestedIndex: number, test: Iterator): number {
    if (stack.length === 0) {
        return -1;
    }
    const cur = stack[stack.length - 1];

    // descend directly to nested item
    if (cur.nested && cur.nested.length > 0) {
        stack.push(cur);
        return 0;
    }

    // on most nested
    if (!test.apply(null, test)) {
        return -1;
    }

    const parent = stack[stack.length - 2];
    if (parent.nested /*make compiler happy*/ && nestedIndex < parent.nested.length) {
        // next
        return ++nestedIndex;
    } else {
        // done with parent
        stack.pop();
        return 0;
    }
}

document.addEventListener("keypress", function selectionKeyPressListener(e: KeyboardEvent) {
    console.log("e", e);
    if (e.charCode === "j".charCodeAt(0)) {
        selectionNext();
    } else if (e.charCode === "k".charCodeAt(0)) {
        selectionPrev();
    }
});
