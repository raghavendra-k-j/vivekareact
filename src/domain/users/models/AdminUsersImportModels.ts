import { JsonObj } from "~/core/types/Json";
import { MobileNumber } from "~/domain/common/models/MobileNumber";
import { UserBase } from "~/domain/common/models/UserBase";

export interface ExtractedUserItemProps {
    name: string | null;
    email: string | null;
    mobile: MobileNumber | null;
    password: string | null;
    roleName: string | null;
}

export class ExtractedUserItem {
    name: string | null;
    email: string | null;
    mobile: MobileNumber | null;
    password: string | null;
    roleName: string | null;

    constructor({ name, email, mobile, password, roleName }: ExtractedUserItemProps) {
        this.name = name;
        this.email = email;
        this.mobile = mobile;
        this.password = password;
        this.roleName = roleName;
    }

    static fromJson(json: any): ExtractedUserItem {
        return new ExtractedUserItem({
            name: json.name,
            email: json.email,
            mobile: json.mobile ? MobileNumber.fromJson(json.mobile) : null,
            password: json.password,
            roleName: json.roleName,
        });
    }

    toJson() {
        return {
            name: this.name,
            email: this.email,
            mobile: this.mobile ? this.mobile.toJson() : null,
            password: this.password,
            roleName: this.roleName,
        };
    }

}

export class ExtractUsersRes {
    users: ExtractedUserItem[];

    constructor(params: { users: ExtractedUserItem[] }) {
        this.users = params.users;
    }

    static fromJson(json: JsonObj): ExtractUsersRes {
        return new ExtractUsersRes({
            users: (json.users as JsonObj[]).map((item) => ExtractedUserItem.fromJson(item)),
        });
    }
}


export class ImportUsersReq {
    users: ExtractedUserItem[];

    constructor(params: { users: ExtractedUserItem[] }) {
        this.users = params.users;
    }

    toJson() {
        return this.users.map((user) => user.toJson());
    }

    static fromJson(json: JsonObj): ImportUsersReq {
        return new ImportUsersReq({
            users: (json as JsonObj[]).map((item) => ExtractedUserItem.fromJson(item)),
        });
    }
}



export class ImportUsersRes {
    users: UserBase[];

    constructor(params: { users: UserBase[] }) {
        this.users = params.users;
    }

    static fromJson(json: JsonObj): ImportUsersRes {
        return new ImportUsersRes({
            users: (json.users as JsonObj[]).map((item) => UserBase.fromJson(item)),
        });
    }

}