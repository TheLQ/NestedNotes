import React from "react";
import { connect } from "react-redux";

import { RootState } from "../state/root";

import TagFilter from "../redux/ui/tagFilter";

import List from "./list";

interface StateFromProps {
	renderedRoots: string[];
}

function newViewComponent(props: StateFromProps): JSX.Element {
	return (
		<div>
			<TagFilter />
			<List rootNotes={props.renderedRoots} even={true} />
		</div>
	);
}

function mapStateToProps(state: RootState, props: any): StateFromProps {
	return {
		renderedRoots: state.activeRoots,
	};
}

const component = connect<StateFromProps, void, {}>(mapStateToProps)(newViewComponent);
export default component;
