import RootModel from "./root";
import SettingsModel from "./settings";
import ItemModel from "./item";

export default class UserRoot extends RootModel {
	static fromJson(rawJson: any): UserRoot {
		const newRoot = new UserRoot();
		newRoot.globalsettings = rawJson.globalsettings;
		newRoot.children = rawJson.roots;
		newRoot.notes = new Map();

		for (const key in rawJson.notes) {
			if (rawJson.notes.hasOwnProperty(key)) {
				const rawItem = rawJson.notes[key];
				if (key != rawItem.id) {
					throw new Error("map id is " + key + " but nested id is " + rawJson.id);
				}
				const value = ItemModel.fromJson(rawItem);
				newRoot.notes.set(key, value);
			}
		}
		newRoot.validate();

		return newRoot;
	}

	public globalsettings: SettingsModel;

	validate() {
		for (const item of this.notes.values()) {
			item.validate(this);
		}
	}

	toJson(): any {
		// rebuild map as json-able key-value object
		const jsonNotes = {} as any;
		for (const value of this.notes.values()) {
			jsonNotes[value.id] = value.toJson();
		}

		return Object.assign({}, this, {
			notes: jsonNotes,
		});
	}
}