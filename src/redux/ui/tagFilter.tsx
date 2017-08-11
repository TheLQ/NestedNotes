import React from "react"; 
import { connect } from "react-redux";

import { AppDataModel } from "../../model/appData";
import { TagModel } from "../../model/tag";

import TagFilterButton from "./tagFilterButton";

interface TagFilterPropsFromState {
	tags: TagModel[];
	selectedTag: TagModel | null;
}

export function TagFilter(props: TagFilterPropsFromState): JSX.Element {
	const tagButtons = props.tags.map((tagIn) => (
			<TagFilterButton
				tag={tagIn}
				selected={tagIn === props.selectedTag}
				key={tagIn.name}
			/>
	));
	return <div>{tagButtons}</div>;
}

function mapStateToProps(state: AppDataModel): TagFilterPropsFromState {
	return {
		tags: Object.values(state.userData.tags),
		selectedTag: state.selectedTag,
	};
}

const component = connect<TagFilterPropsFromState, void, {}>(mapStateToProps)(TagFilter);
export default component;
