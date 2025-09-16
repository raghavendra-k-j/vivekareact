import { JsonObj } from "~/core/types/Json";

export class AdminFormsCategoryFilterRes {
    categories: FormsCategoriesFilterTile[];

    constructor({ categories }: { categories: FormsCategoriesFilterTile[] }) {
        this.categories = categories;
    }

    static fromJson(json: JsonObj): AdminFormsCategoryFilterRes {
        return new AdminFormsCategoryFilterRes({
            categories: (json.categories as JsonObj[]).map(itemJson => FormsCategoriesFilterTile.fromJson(itemJson)),
        });
    }
}

export class FormsCategoriesFilterTile {
    id: number;
    name: string;

    constructor({
        id,
        name
    }: {
        id: number;
        name: string;
    }) {
        this.id = id;
        this.name = name;
    }

    static fromJson(json: JsonObj): FormsCategoriesFilterTile {
        return new FormsCategoriesFilterTile({
            id: Number(json.id),
            name: String(json.name),
        });
    }

    equals(other: FormsCategoriesFilterTile): boolean {
        return this.id === other.id && this.name === other.name;
    }

    get hashCode(): number {
        return this.id ^ this.name.length;
    }
}


