import { JsonObj } from "~/core/types/Json";
import { Org } from "./Org";
import { OrgTheme } from "./OrgTheme";

export type OrgConfigProps = {
    org: Org;
    theme: OrgTheme;
};

export class OrgConfig {

    readonly org: Org;
    readonly theme: OrgTheme;

    constructor(props: OrgConfigProps) {
        this.org = props.org;
        this.theme = props.theme;
    }

    static fromJson(json: JsonObj): OrgConfig {
        const org = Org.fromJson(json.org);
        const theme = json.theme ? OrgTheme.fromJson(json.theme) : OrgTheme.default();
        return new OrgConfig({
            org: org,
            theme: theme,
        });
    }

    copyWith(params: Partial<OrgConfigProps>): OrgConfig {
        return new OrgConfig({
            org: params.org ?? this.org,
            theme: params.theme ?? this.theme,
        });
    }

}
