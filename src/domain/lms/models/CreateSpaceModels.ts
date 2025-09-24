import { JsonObj } from "~/core/types/Json";
import { SpaceType } from "./SpaceType";
import { AvatarColor } from "~/domain/common/models/AvatarColor";

export class CreateSpaceReq {
    public name: string;
    public internalName: string | null;
    public type: SpaceType;
    public parentId: number | null;
    public avatarColor: AvatarColor | null;

    constructor({ name, internalName = null, type, parentId = null, avatarColor = null }: { name: string, internalName: string | null, type: SpaceType, parentId: number | null, avatarColor: AvatarColor | null }) {
        this.name = name;
        this.internalName = internalName;
        this.type = type;
        this.parentId = parentId;
        this.avatarColor = avatarColor;
    }

    toJson(): JsonObj {
        return {
            name: this.name,
            internalName: this.internalName,
            type: this.type.value,
            parentId: this.parentId,
            avatarColor: this.avatarColor?.toJson()
        };
    }
}

export class CreateSpaceRes {
    public id: number;
    public permalink: string;

    constructor({ id, permalink }: { id: number, permalink: string }) {
        this.id = id;
        this.permalink = permalink;
    }

    static fromJson(json: JsonObj): CreateSpaceRes {
        return new CreateSpaceRes({
            id: Number(json.id),
            permalink: String(json.permalink)
        });
    }
}