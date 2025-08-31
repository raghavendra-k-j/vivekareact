import { JsonObj } from "~/core/types/Json";
import type { AbsUserBase, AbsUserProps } from "./AbsUserBase";

export type GuestBaseProps = AbsUserProps & {
    emailVerified: boolean;
}

export class GuestBase implements AbsUserBase {

    private _id: number;
    private _name: string;
    private _email: string;
    private _mobile: string | null;
    private _emailVerified: boolean;

    constructor(props: GuestBaseProps) {
        this._id = props.id;
        this._name = props.name;
        this._email = props.email;
        this._mobile = props.mobile;
        this._emailVerified = props.emailVerified;
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

    get emailVerified(): boolean {
        return this._emailVerified;
    }

    static fromJson(json: JsonObj): GuestBase {
        return new GuestBase({
            id: json.id,
            name: json.name,
            email: json.email,
            mobile: json.mobile,
            emailVerified: json.emailVerified,
        });
    }

}
