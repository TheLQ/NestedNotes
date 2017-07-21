import jQuery from "jquery";

import * as ItemReact from "./ui/item";

export class Root {
    public globalsettings: GlobalSettings;
    public notes: Item[];

    toJson(): any {
        return {
            "globalsettings": this.globalsettings,
            "notes": this.notes.map((item) => item.toJson())
        }
    }

    static fromJsonRecursive(rawJson: any): Root {
        let newRoot = new Root();
        Object.assign(newRoot, rawJson);

        newRoot.notes = newRoot.notes.map((topItem: any) => Item.fromJsonRecursive(topItem));

        return newRoot;
    }
}

export class GlobalSettings {
    public name: string;
}

export class Item {
    public id: number;
    public text: string;
    public tags: string[] = [];
    public settings: ItemSettings = [];
    public nested: Item[] = [];

    // ui
    reactComponent?: ItemReact.Component;
    // public reactElement?: JSX.Element;

    toJson(): any {
        return {
            "id": this.id,
            "text": this.text,
            "tags": this.tags,
            "settings": this.settings,
            "nested": this.nested.map((nested) => nested.toJson())
        }
    }

    static fromJsonRecursive(rawJsonItem: any) {
        let newItem = new Item();
        Object.assign(newItem, rawJsonItem);
        console.log("uite", newItem);

        newItem.nested = newItem.nested.map((subItem: any) => Item.fromJsonRecursive(subItem));

        return newItem;
    }
}

export class ItemSettings {
}

export function react(item: Item) {
        if (item.reactComponent == null) {
            throw new Error("reactComponent is not set");
        }
        return item.reactComponent;
    }

let activeConfig: Root;
export function initActiveConfig(callback: () => any) {
    jQuery.ajax({
        url: "../src-php/json.php",
        dataType: "json"
    }).done((data) => {
        console.log("fetched data", data);
        activeConfig = Root.fromJsonRecursive(data);

        callback();
    });
}

export function saveActiveConfig() {
    jQuery.post({
        url: "../src-php/json.php?mode=save",
        // dataType: "json",
        data: activeConfig.toJson()
    }).done((data) => {
        console.log("sent data", data);
        // activeConfig = data;

        // callback();
    });
}

export function getActiveConfig() {
    return activeConfig;
}

