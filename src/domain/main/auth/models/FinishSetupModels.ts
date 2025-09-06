import { JsonObj } from "~/core/types/Json";

export class SignUpFinishSetupReq {

    requestUid: string;
    orgName: string;
    subdomain: string;
    orgType: string;
    orgTypeCustom: string | null;

    constructor(props: { requestUid: string; orgName: string; subdomain: string; orgType: string; orgTypeCustom: string | null }) {
        this.requestUid = props.requestUid;
        this.orgName = props.orgName;
        this.subdomain = props.subdomain;
        this.orgType = props.orgType;
        this.orgTypeCustom = props.orgTypeCustom ?? null;
    }

    toJson() {
        return {
            requestUid: this.requestUid,
            orgName: this.orgName,
            subdomain: this.subdomain,
            orgType: this.orgType,
            orgTypeCustom: this.orgTypeCustom,
        };
    }

}

export class SignUpFinishSetupRes {
    requestUid: string;
    redirectUrl: string;

    constructor(props: { requestUid: string; redirectUrl: string }) {
        this.requestUid = props.requestUid;
        this.redirectUrl = props.redirectUrl;
    }

    static fromJson(json: JsonObj) {
        return new SignUpFinishSetupRes({
            requestUid: json.requestUid as string,
            redirectUrl: json.redirectUrl as string,
        });
    }
}