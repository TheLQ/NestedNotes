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

export const activeConfig: Root = {
    globalsettings: {
        name: "myFirstTime",
    },
    notes: [
        {
            id: 1,
            settings: {},
            text: "level 1",
            nested: [
                {
                    id: 2,
                    text: "level 1.1",
                },
                {
                    id: 3,
                    text: "level 1.2",
                },
            ],
        },
        {
            id: 4,
            text: "level 2",
            nested: [
                {
                    id: 5,
                    text: "level 2.1",
                    nested: [
                        {
                            id: 6,
                            text: "level 2.1.1",
                        },
                    ],
                },
                {
                    id: 7,
                    text: "level 2.2",
                },

            ],
        },
    ],
};
