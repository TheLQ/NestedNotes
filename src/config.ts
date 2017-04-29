export class Root {
    globalsettings: GlobalSettings
    notes: Array<Item>
}

export class GlobalSettings {
    name: String;
}

export class Item {
    id: number;
    text: string;
    settings?: ItemSettings;
    nested?: Array<Item>;
}

export class ItemSettings {   
}

export const example: Root = {
    "globalsettings": {
        "name": "myFirstTime"
    },
    "notes": [
        {
            "id": 1,
            "settings": {},
            "text": "level 1",
            "nested": [
                {
                    "id": 2,
                    "text": "level 1.1"
                },
                {
                    "id": 3,
                    "text": "level 1.2"
                }
            ]
        },
        {
            "id": 4,
            "text": "level 2",
            "nested": [
                {
                    "id": 5,
                    "text": "level 2.1",
                    "nested": [
                        {
                            "id": 6,
                            "text": "level 2.1.1"
                        }
                    ]
                },
                {
                    "id": 7,
                    "text": "level 2.2"
                }

            ]
        }
    ]
}