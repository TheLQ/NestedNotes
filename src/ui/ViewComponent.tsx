import React from "react";
import { connect } from "react-redux";

import { RootState } from "../state/RootState";

import { TagFilter } from "./TagFilter";

import { ListComponent } from "./ListComponent";

interface Props {
	viewId: string;
}

interface StateFromProps {
	renderedRoots: string[];
}

function ViewComponentRender(props?: StateFromProps & Props): JSX.Element {
	if (props === undefined) {
		throw new Error("no props");
	}

	return (
		<div>
			<TagFilter viewId={props.viewId} />
			<ListComponent viewId={props.viewId} rootNotes={props.renderedRoots} even={true} />
		</div>
	);
}

function mapStateToProps(state: RootState, props?: Props): StateFromProps {
	if (props === undefined) {
		throw new Error("no props");
	}

	const view = state.client.views.entries[props.viewId];
	if (view === undefined) {
		throw new Error(`view does not exist: ${props.viewId}`);
	}

	return {
		renderedRoots: view.items.roots,
	};
}

export const ViewComponent = connect<StateFromProps, void, Props>(mapStateToProps)(ViewComponentRender);
