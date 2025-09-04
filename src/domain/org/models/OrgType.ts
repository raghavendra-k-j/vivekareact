import { JsonObj } from "~/core/types/Json";

export class OrgType {

    type: string;
    label: string;

    constructor(props: { type: string; label: string }) {
        this.type = props.type;
        this.label = props.label;
    }

    static fromJson(json: JsonObj): OrgType {
        return new OrgType({
            type: json.type,
            label: json.label,
        });
    }
}