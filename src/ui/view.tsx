import React from "react";

import * as ActiveRoot from "../model/active";
import {ItemComponent} from "./item";
import {ErrorComponent} from "./error";
import * as Error from "./error";
import * as Selection from "./selection";

export class ViewProperty {
	initRenderer: Renderer;
}

export class ViewState {
	filter: Renderer;
}

type Renderer = () => JSX.Element;
export const defaultRenderer: Renderer = () => {
	return ItemComponent.renderList(
		ActiveRoot.getActiveConfig().children,
		true
	);
}

function tagFilter(tag: string): Renderer {
	return () => {
		const roots: string[] = [];
		for (const item of ActiveRoot.getActiveConfig().notes.values()) {
			if (item.tags.has(tag)) {
				roots.push(item.id);
			}
		}
		return ItemComponent.renderList(roots, true);
	};
}

export class ViewComponent extends React.Component<ViewProperty, ViewState> {
	changedFilter: boolean = true;

	constructor(props: ViewProperty) {
		super(props);
		this.state = {
			filter: this.props.initRenderer
		};

		this.onclick = this.onclick.bind(this);
	}

	onclick(e: React.FormEvent<HTMLButtonElement>) {
		this.setState((oldState: ViewState) => {
			oldState.filter = tagFilter("Later")
		})
	}

	render() {
		return (
			<div>
				<ErrorComponent ref={Error.setComponent} />
				<button onClick={this.onclick}>Tag: Test</button>
				{this.state.filter()}
			</div>
		)
	}
}