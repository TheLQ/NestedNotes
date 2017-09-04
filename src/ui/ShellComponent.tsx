import React from "react";
import { connect } from "react-redux";

import { RootState } from "../state/RootState";

import ViewComponent from "./ViewComponent";

interface StateFromProps {
	name: string;
	viewIds: string[];
}

function ShellComponent(props: StateFromProps): JSX.Element {
	const views = props.viewIds.map(
		(viewId) => <ViewComponent viewId={viewId} key={viewId} />,
	);
	return (
		<div id="shell">
			<h1>{props.name}</h1>
			<div id="views">
				{views}
			</div>
		</div>
	);
}

function mapStateToProps(state: RootState, props: any): StateFromProps {
	return {
		name: state.user.name,
		viewIds: Object.keys(state.client.views)
	};
}

const component = connect<StateFromProps, void, {}>(mapStateToProps)(ShellComponent);
export default component;
