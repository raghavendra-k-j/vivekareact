import { MobileNumber } from "~/domain/common/models/MobileNumber";

export interface UpsertUserParams {
    id: number | null;
    email: string;
    mobile: MobileNumber | null;
    name: string;
    password: string | null;
    roleId: number;
}

export class UpsertUserReq {

    id: number | null;
    email: string;
    mobile: MobileNumber | null;
    name: string;
    password: string | null;
    roleId: number;

    constructor({ id, email, mobile, name, password, roleId }: UpsertUserParams) {
        this.id = id;
        this.email = email;
        this.mobile = mobile;
        this.name = name;
        this.password = password;
        this.roleId = roleId;
    }

    toJson() {
        return {
            id: this.id,
            email: this.email,
            mobile: this.mobile ? this.mobile.toJson() : null,
            name: this.name,
            password: this.password,
            roleId: this.roleId,
        };
    }

}