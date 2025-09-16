import { JsonObj } from "~/core/types/Json";

export class AttachCategoriesRes {
    items: AttachCategoriesTile[];

    constructor({ items }: { items: AttachCategoriesTile[] }) {
        this.items = items;
    }

    static fromJson(json: JsonObj): AttachCategoriesRes {
        return new AttachCategoriesRes({
            items: (json.items as JsonObj[]).map(itemJson => AttachCategoriesTile.fromJson(itemJson)),
        });
    }
}

export class AttachCategoriesTile {
    id: number;
    name: string;
    selected: boolean;

    constructor({
        id,
        name,
        selected
    }: {
        id: number;
        name: string;
        selected: boolean;
    }) {
        this.id = id;
        this.name = name;
        this.selected = selected;
    }

    static fromJson(json: JsonObj): AttachCategoriesTile {
        return new AttachCategoriesTile({
            id: Number(json.id),
            name: String(json.name),
            selected: Boolean(json.selected),
        });
    }
}

