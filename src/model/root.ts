import ItemModel from "./item";

type ItemIdMap = Map<string, ItemModel>;

export default class Root {
	public notes: ItemIdMap;
	public children: string[];

	getAllTags(): string[] {
		const tags: string[] = [];
		this.notes.forEach((curItem) => {
			if (curItem.tags == null) {
				return;
			}
			curItem.tags.forEach((curTag) => {
				if (tags.indexOf(curTag) === -1) {
					tags.push(curTag);
				}
			});
		});
		return tags;
	}

	getItem(id: string): ItemModel {
		if (id == null) {
			throw new Error("id is " + id);
		}
		const item = this.notes.get(id);
		if (item == null) {
			// console.log("id is", id);
			// activeConfig.notes.forEach((key, value) => {
			// 	console.log("key ", key);
			// });
			throw new Error("Missing item " + id + " out of " + this.notes.size);
		}
		return item;
	}
}

