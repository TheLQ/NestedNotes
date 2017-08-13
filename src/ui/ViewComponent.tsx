import React from "react";
import { connect } from "react-redux";

import { RootState } from "../state/RootState";

import TagFilter from "../redux/ui/TagFilter";

import ListComponent from "./ListComponent";

interface StateFromProps {
	renderedRoots: string[];
}

function ViewComponent(props: StateFromProps): JSX.Element {
	return (
		<div>
			<TagFilter />
			<ListComponent rootNotes={props.renderedRoots} even={true} />
		</div>
	);
}

function mapStateToProps(state: RootState, props: any): StateFromProps {
	return {
		renderedRoots: state.activeRoots,
	};
}

const component = connect<StateFromProps, void, {}>(mapStateToProps)(ViewComponent);
export default component;
