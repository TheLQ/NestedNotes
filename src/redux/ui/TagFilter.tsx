import React from "react"; 
import { connect } from "react-redux";

import { RootState } from "../../state/RootState";
import { TagState } from "../../state/user/TagState";

import { getActiveView } from "../../utils";
import TagFilterButton from "./TagFilterButton";

interface TagFilterProps {
	viewId: string;
}

interface TagFilterPropsFromState {
	tags: TagState[];
}

export function TagFilter(props: TagFilterPropsFromState & TagFilterProps): JSX.Element {
	const tagButtons = props.tags.map((tagIn) => (
			<TagFilterButton
				viewId={props.viewId}
				tag={tagIn}
				key={tagIn.name}
			/>
	));
	return <div>{tagButtons}</div>;
}

function mapStateToProps(state: RootState): TagFilterPropsFromState {
	const view = getActiveView(state);
	return {
		tags: Object.values(view.tags),
	};
}

const component = connect<TagFilterPropsFromState, void, TagFilterProps>(mapStateToProps)(TagFilter);
export default component;
