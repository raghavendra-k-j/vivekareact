import { JsonObj } from "~/core/types/Json";
import type { AbsUserBase, AbsUserProps } from "./AbsUserBase";

type UserBaseProps = AbsUserProps & {
    userName: string | null;
}

export class UserBase implements AbsUserBase {

    private _id: number;
    private _name: string;
    private _email: string;
    private _mobile: string | null;
    private _userName: string | null;

    constructor(props: UserBaseProps) {
        this._id = props.id;
        this._name = props.name;
        this._email = props.email;
        this._mobile = props.mobile;
        this._userName = props.userName;
    }

    get id(): number {
        return this._id;
    }
    
    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get mobile(): string | null {
        return this._mobile;
    }

    get userName(): string | null {
        return this._userName;
    }

    static fromJson(json: JsonObj): UserBase {
        return new UserBase({
            id: json.id,
            name: json.name,
            email: json.email,
            mobile: json.mobile,
            userName: json.userName,
        });
    }

    toJson(): JsonObj {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            mobile: this._mobile,
            userName: this._userName,
        };
    }

}