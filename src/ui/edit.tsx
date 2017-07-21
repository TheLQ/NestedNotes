import React from "react";
import * as Config from "../config";
import * as Selection from "./selection";

import * as Item from "./item";

export class Property {
    item: Config.Item;
}

export class State {
    newValue: string;
}

export class Component extends React.Component<Property, State> {
    nestedComponents: Array<Item.Component> = [];
    

    constructor(props: Property) {
        super(props);

        this.state = {
            newValue: this.props.item.text
        };

        this.onTextEdit = this.onTextEdit.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        
        // do stuff with data
        this.props.item.text = this.state.newValue;

        // and then cleanup
        
        changeIsEditing(false);
        
    }

    onTextEdit(event: React.FormEvent<HTMLTextAreaElement>) {
        this.setState({
            newValue: event.currentTarget.value
        })
    }

    /**
     * Stop parent item's onClick selection listener run
     * @param event 
     */
    blockOnClick(event: React.MouseEvent<HTMLFormElement>) {
        event.stopPropagation();
    }

    render(): JSX.Element {
        return (
            <form onSubmit={this.onSubmit} onClick={this.blockOnClick}>
                <textarea rows={20} cols={80} value={this.state.newValue} onChange={this.onTextEdit}/> 
                <input type='checkbox' id='bulkAdd' name='bulkAdd'/>
                <label htmlFor='bulkAdd'>Bulk Add</label> 
                <input type='submit' value='submit'/>
            </form>
        );
    }
}

function changeIsEditing(to: boolean) {
    let activeReact = Selection.getActiveSelection().reactComponent;
    if (activeReact != null) {
        activeReact.setState({
            isEditing: to
        });
    }
} 

document.addEventListener("keypress", function selectionKeyPressListener(e: KeyboardEvent) {
    console.log("e", e);
    if (e.charCode === "e".charCodeAt(0)) {
        console.log("yay");
        changeIsEditing(true);
    }
});