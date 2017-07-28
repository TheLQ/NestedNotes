import React from "react";

import {ItemComponent} from "./item";

export class ErrorProperty {
}

export class ErrorState {
	error: string;
}

export class ErrorComponent extends React.Component<ErrorProperty, ErrorState> {
	nestedComponents: ItemComponent[] = [];

	constructor(props: ErrorProperty) {
		super(props);

		this.state = {
			error: "",
		};
	}

	render(): JSX.Element {
		return (
			<h1 className={this.state.error.length === 0 ? "errorHidden" : "errorDisplayed"}>{this.state.error}</h1>
		);
	}
}

let activeComponent: ErrorComponent | null;
export function setComponent(component: ErrorComponent | null) {
	activeComponent = component;
}

export function setError(text: string) {
	if (activeComponent != null) {
		activeComponent.setState({
			error: text,
		});
	}
}
