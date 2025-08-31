import { JsonObj } from "~/core/types/Json";
import { Org } from "./Org";

export type OrgConfigProps = {
    org: Org;
};

export class OrgConfig {
    readonly org: Org;

    constructor(props: OrgConfigProps) {
        this.org = props.org;
    }

    static fromJson(json: JsonObj): OrgConfig {
        const org = Org.fromJson(json.org);
        return new OrgConfig({
            org: org,
        });
    }
}
