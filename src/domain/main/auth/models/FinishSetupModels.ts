import { JsonObj } from "~/core/types/Json";

export class SignUpFinishSetupReq̥ {

    requestUid: string;
    orgName: string;
    subdomain: string;
    orgType: string;
    orgCustomType: string | null;

    constructor(props: { requestUid: string; orgName: string; subdomain: string; orgType: string; orgCustomType: string | null }) {
        this.requestUid = props.requestUid;
        this.orgName = props.orgName;
        this.subdomain = props.subdomain;
        this.orgType = props.orgType;
        this.orgCustomType = props.orgCustomType ?? null;
    }

    toJson() {
        return {
            requestUid: this.requestUid,
            orgName: this.orgName,
            subdomain: this.subdomain,
            orgType: this.orgType,
            orgCustomType: this.orgCustomType,
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