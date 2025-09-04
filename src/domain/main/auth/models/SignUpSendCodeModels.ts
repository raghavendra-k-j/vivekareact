import { JsonObj } from "~/core/types/Json";

export class SignUpSendCodeReq {

    requestUid: string;

    constructor(props: { requestUid: string }) {
        this.requestUid = props.requestUid;
    }

    toJson(): { requestUid: string } {
        return {
            requestUid: this.requestUid,
        };
    }

}

export class SignUpSendCodeRes {

    requestUid: string;
    email: string;
    otpId: number;
    otpPrefix: string;

    constructor(props: { requestUid: string; email: string; otpId: number; otpPrefix: string }) {
        this.requestUid = props.requestUid;
        this.email = props.email;
        this.otpId = props.otpId;
        this.otpPrefix = props.otpPrefix;
    }

    static fromJson(json: JsonObj): SignUpSendCodeRes {
        return new SignUpSendCodeRes({
            requestUid: String(json.requestUid),
            email: String(json.email),
            otpId: Number(json.otpId),
            otpPrefix: String(json.otpPrefix),
        });
    }

}