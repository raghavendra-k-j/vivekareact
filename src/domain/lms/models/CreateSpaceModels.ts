import { JsonObj } from "~/core/types/Json";
import { SpaceType } from "./SpaceType";

export class CreateSpaceReq {
    public name: string;
    public internalName: string | null;
    public type: SpaceType;
    public parentId: number | null;

    constructor({ name, internalName = null, type, parentId = null }: { name: string, internalName: string | null, type: SpaceType, parentId: number | null }) {
        this.name = name;
        this.internalName = internalName;
        this.type = type;
        this.parentId = parentId;
    }

    toJson(): JsonObj {
        return {
            name: this.name,
            internalName: this.internalName,
            type: this.type.value,
            parentId: this.parentId
        };
    }
}

export class CreateSpaceRes {
    public id: number;

    constructor({ id }: { id: number }) {
        this.id = id;
    }

    static fromJson(json: JsonObj): CreateSpaceRes {
        return new CreateSpaceRes({
            id: Number(json.id)
        });
    }
}