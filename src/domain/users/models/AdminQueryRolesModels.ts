import { JsonObj } from "~/core/types/Json";
import { AdminUserRoleItem } from "./AdminUserRoleItem";

export class AdminQueryRolesRes {

    items: AdminUserRoleItem[];

    constructor(params: { items: AdminUserRoleItem[] }) {
        this.items = params.items;
    }

    static fromJson(json: JsonObj): AdminQueryRolesRes {
        return new AdminQueryRolesRes({
            items: (json.items as JsonObj[]).map((item) => AdminUserRoleItem.fromJson(item)),
        });
    }
}