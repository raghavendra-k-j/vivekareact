import { JsonObj } from "~/core/types/Json";

export class SignUpInitReq {
    name: string;
    email: string;
    callingCode: string;
    mobile: string;
    password: string;

    constructor(props: { name: string; email: string; callingCode: string; mobile: string; password: string }) {
        this.name = props.name;
        this.email = props.email;
        this.callingCode = props.callingCode;
        this.mobile = props.mobile;
        this.password = props.password;
    }

    toJson(): JsonObj {
        return {
            name: this.name,
            email: this.email,
            callingCode: this.callingCode,
            mobile: this.mobile,
            password: this.password,
        };
    }

}


export class SignUpInitRes {
    requestUid: string;

    constructor(props: { requestUid: string }) {
        this.requestUid = props.requestUid;
    }

    static fromJson(json: JsonObj): SignUpInitRes {
        return new SignUpInitRes({
            requestUid: String(json.requestUid),
        });
    }

}