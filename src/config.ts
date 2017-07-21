import * as ItemReact from "./ui/item";

export class Root {
    public globalsettings: GlobalSettings;
    public notes: Item[];
}

export class GlobalSettings {
    public name: string;
}

export class Item {
    public id: number;
    public text: string;
    public tags?: string[];
    public settings?: ItemSettings;
    public nested?: Item[];

    // ui
    reactComponent?: ItemReact.Component;
    // public reactElement?: JSX.Element;
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
export function setActiveConfig(config: Root) {
    activeConfig = config;
}

export function getActiveConfig() {
    return activeConfig;
}


