import { JsonObj } from "~/core/types/Json";
import { PermissionBase } from "~/domain/common/models/PermissionBase";
import { UserRoleType } from "~/domain/common/models/UserRoleType";

export class UserPermission {
    base: PermissionBase;
    description: string;
    dOrder: number;
    type: UserRoleType;

    constructor({ base, description, dOrder, type }: { base: PermissionBase; description: string; dOrder: number; type: UserRoleType }) {
        this.base = base;
        this.description = description;
        this.dOrder = dOrder;
        this.type = type;
    }

    static fromJson(json: JsonObj): UserPermission {
        return new UserPermission({
            base: PermissionBase.fromJson(json),
            description: json.description,
            dOrder: json.dOrder,
            type: UserRoleType.fromValueStr(json.type),
        });
    }

}