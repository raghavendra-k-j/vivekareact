import { JsonObj } from "~/core/types/Json";

export class ShortUserInfo {
    id: number;
    name: string;

    constructor({ id, name }: { id: number; name: string }) {
        this.id = id;
        this.name = name;
    }

    static fromJson(json: JsonObj): ShortUserInfo {
        return new ShortUserInfo({
            id: Number(json.id),
            name: String(json.name),
        });
    }
}