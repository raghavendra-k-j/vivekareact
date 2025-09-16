import { JsonObj } from "~/core/types/Json";

export class TopicBase {
    id: number;
    name: string;

    constructor({ id, name }: { id: number; name: string }) {
        this.id = id;
        this.name = name;
    }

    static fromJson(json: JsonObj): TopicBase {
        return new TopicBase({
            id: Number(json.id),
            name: String(json.name),
        });
    }

}