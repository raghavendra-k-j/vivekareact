import { JsonObj } from "~/core/types/Json";
import { AvatarColor } from "~/domain/common/models/AvatarColor";

export class RenameSpaceReq {
    id: number;
    name: string;
    internalName: string | null;
    avatarColor: AvatarColor;

    constructor({ id, name, internalName, avatarColor }: { id: number, name: string, internalName: string | null, avatarColor: AvatarColor }) {
        this.id = id;
        this.name = name;
        this.internalName = internalName;
        this.avatarColor = avatarColor;
    }

    toJson(): JsonObj {
        return {
            id: this.id,
            name: this.name,
            internalName: this.internalName,
            avatarColor: this.avatarColor,
        };
    }
}

export class RenameSpaceRes {
    id: number;

    constructor(id: number) {
        this.id = id;
    }

    static fromJson(json: JsonObj): RenameSpaceRes {
        return new RenameSpaceRes(json.id);
    }
}