import { JsonObj } from "~/core/types/Json";

export class FormCategoryTile {

    id: number;
    name: string;

    constructor({ id, name }: { id: number; name: string }) {
        this.id = id;
        this.name = name;
    }

    static fromJson(json: JsonObj): FormCategoryTile {
        return new FormCategoryTile({
            id: Number(json.id),
            name: String(json.name),
        });
    }

}