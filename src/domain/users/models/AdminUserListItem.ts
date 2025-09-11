import { JsonObj } from "~/core/types/Json";
import { UserBase } from "~/domain/common/models/UserBase";
import { UserRoleBase } from "~/domain/common/models/UserRoleBase";

export class AdminUserListItem {

    base: UserBase;
    createdAt: Date;
    role: UserRoleBase;

    constructor({ base, createdAt, role }: { base: UserBase; createdAt: Date; role: UserRoleBase }) {
        this.base = base;
        this.createdAt = createdAt;
        this.role = role;
    }

    static fromJson(json: JsonObj): AdminUserListItem {
        return new AdminUserListItem({
            base: UserBase.fromJson(json),
            createdAt: new Date(json.createdAt),
            role: UserRoleBase.fromJson(json.role),
        });
    }

}