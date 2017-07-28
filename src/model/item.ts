import RootModel from "./root";
import SettingsModel from "./settings";
import * as Utils from "../utils";

export default class ItemModel {
	static fromJson(rawJsonItem: any): ItemModel {
		const newItem = new ItemModel();
		Object.assign(newItem, rawJsonItem);

		newItem.links = new Set<string>(rawJsonItem.links);
		newItem.tags = new Set<string>(rawJsonItem.tags);

		if (newItem.children == null) {
			newItem.children = [];
		}
		if (newItem.settings == null) {
			newItem.settings = new SettingsModel();
		}

		return newItem;
	}

	public id: string;
	public parent: string;
	public children: string[] = [];
	public text: string = "";
	public tags: Set<string> = new Set<string>();
	public settings: SettingsModel = new SettingsModel();
	public links: Set<string> = new Set<string>();

	getParent(root: RootModel): ParentData {
		if (this.parent != null) {
			const parent = root.getItem(this.parent);
			const childIndex = parent.children.indexOf(this.id);
			if (childIndex == -1) {
				console.log("parent", parent );
				throw new Error("could not find child " + this.id + " in parent " + parent.id);
			}
			return {
				parent: parent,
				parentChildren: parent.children,
				indexOfChild: childIndex
			};
		} else {
			const childIndex = root.children.indexOf(this.id);
			if (childIndex == -1) {
				throw new Error("could not find child " + this.id + " in roots");
			}
			return {
				parent: null,
				parentChildren: root.children,
				indexOfChild: childIndex
			}
		}
	}

	delete(root: RootModel) {
		const parent = root.notes.get(this.parent);
		if (parent != null) {
			parent.children.splice(
				Utils.indexOfOrError(parent.children, this.id),
				1
			);
		} else {
			root.children.splice(
				Utils.indexOfOrError(root.children, this.id),
				1
			);
		}
	}

	validate(root: RootModel) {
		if (!root.notes.has(this.id)) {
			throw new Error("Failed to find id " + this.id);
		} else if (this.children == null) {
			throw new Error("children is null for " + this.id);
		} else if (this.tags == null) {
			throw new Error("tags is null for " + this.id);
		} else if (this.settings == null) {
			throw new Error("settings is null for " + this.id);
		} else if (this.links == null) {
			throw new Error("links is null for " + this.id);
		} else if (this.text == null) {
			throw new Error("text is null for " + this.id);
		}

		if (this.parent == null) {
			if (root.children.indexOf(this.id) == -1) {
				throw new Error("Item " + this.id + " has no parent but not in roots");
			}
		} else {
			const parent = root.notes.get(this.parent);
			if (parent == null) {
				throw new Error("Failed to find parent id " + this.parent);
			} else if (parent.children == null) {
				throw new Error("Parent id " + parent.id + " has no children");
			} else if (parent.children.indexOf(this.id) == -1) {
				throw new Error("Parent id " + parent.id + " does not contain it's child id " + this.id);
			}
		}
	}

	toJson() {
		return Object.assign({}, this, {
			tags: [...this.tags],
			links: [...this.links],
		});
	}
}

export class ParentData {
	parent: ItemModel | null;
	parentChildren: string[];
	indexOfChild: number;
}
