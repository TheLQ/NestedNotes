import React from "react";
import { connect } from "react-redux";

import { RootState } from "../../state/RootState";
import { TagState } from "../../state/user/TagState";

import { TagFilterButton } from "./TagFilterButton";

interface TagFilterProps {
	viewId: string;
}

interface TagFilterPropsFromState {
	tags: TagState[];
}

function TagFilterRender(props: TagFilterPropsFromState & TagFilterProps): JSX.Element {
	const tagButtons = props.tags.map((tagIn) => (
			<TagFilterButton
				viewId={props.viewId}
				tag={tagIn}
				key={tagIn.name}
			/>
	));

	return <div>{tagButtons}</div>;
}

function mapStateToProps(state: RootState, props: TagFilterProps): TagFilterPropsFromState {
	const view = state.client.views.entries[props.viewId];

	return {
		tags: Object.values(view.tags.entries),
	};
}

export const TagFilter = connect<TagFilterPropsFromState, void, TagFilterProps>(mapStateToProps)(TagFilterRender);
