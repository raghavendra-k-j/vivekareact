import { JsonObj } from "~/core/types/Json";

export class CategoryTile {

    id: number;
    name: string;

    constructor(props: { id: number; name: string }) {
        this.id = props.id;
        this.name = props.name;
    }

    static fromJson(json: JsonObj): CategoryTile {
        return new CategoryTile({
            id: Number(json.id),
            name: String(json.name)
        });
    }
}