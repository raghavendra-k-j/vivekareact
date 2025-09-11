import { JsonObj } from "~/core/types/Json";
import { PermissionBase } from "~/domain/common/models/PermissionBase";
import { UserRoleBase } from "~/domain/common/models/UserRoleBase";
import { UserRoleType } from "~/domain/common/models/UserRoleType";


export class AdminUserPermission {
    base: PermissionBase;
    description: string;
    type: UserRoleType;

    constructor({ base, description, type }: { base: PermissionBase; description: string; type: UserRoleType }) {
        this.base = base;
        this.description = description;
        this.type = type;
    }

    static fromJson(json: JsonObj): AdminUserPermission {
        return new AdminUserPermission({
            base: PermissionBase.fromJson(json),
            description: json.description,
            type: UserRoleType.fromValueStr(json.type),
        });
    }
}


export class AdminUserRoleItem {
    base: UserRoleBase;
    permissions: AdminUserPermission[];

    constructor({ base, permissions }: { base: UserRoleBase; permissions: AdminUserPermission[] }) {
        this.base = base;
        this.permissions = permissions;
    }

    static fromJson(json: JsonObj): AdminUserRoleItem {
        return new AdminUserRoleItem({
            base: UserRoleBase.fromJson(json),
            permissions: (json.permissions as JsonObj[]).map((item) => AdminUserPermission.fromJson(item)),
        });
    }

}