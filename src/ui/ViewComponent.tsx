import React from "react";
import { connect } from "react-redux";

import { RootState } from "../state/RootState";

import TagFilter from "../redux/ui/TagFilter";

import ListComponent from "./ListComponent";

interface Props {
	viewId: string;
}

interface StateFromProps {
	renderedRoots: string[];
}

function ViewComponent(props: StateFromProps & Props): JSX.Element {
	return (
		<div>
			<TagFilter viewId={props.viewId} />
			<ListComponent viewId={props.viewId} rootNotes={props.renderedRoots} even={true} />
		</div>
	);
}

function mapStateToProps(state: RootState, props: Props): StateFromProps {
	const view = state.client.views[props.viewId];
	if (view == null) {
		throw new Error(`view does not exist: ${props.viewId}`);
	}
	return {
		renderedRoots: view.rootItems,
	};
}

const component = connect<StateFromProps, void, Props>(mapStateToProps)(ViewComponent);
export default component;
