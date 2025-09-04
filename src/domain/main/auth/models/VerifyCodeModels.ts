export class SignUpVerifyCodeReq {
    requestUid: string;
    otpId: number;
    otp: string;

    constructor(props: { requestUid: string; otpId: number; otp: string }) {
        this.requestUid = props.requestUid;
        this.otpId = props.otpId;
        this.otp = props.otp;
    }

    toJson() {
        return {
            requestUid: this.requestUid,
            otpId: this.otpId,
            otp: this.otp,
        };
    }
}

export class SignUpVerifyCodeRes {
    requestUid: string;

    constructor(props: { requestUid: string }) {
        this.requestUid = props.requestUid;
    }

    static fromJson(json: any) {
        return new SignUpVerifyCodeRes({
            requestUid: json.requestUid,
        });
    }
}
