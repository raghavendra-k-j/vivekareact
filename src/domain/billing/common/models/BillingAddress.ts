import { PartyType } from "./PartyType";
import { JsonObj } from "~/core/types/Json";

export type BillingAddressProps = {
    id: number;
    orgId: number;
    userId: number;
    partyType: PartyType;
    companyName: string | null;
    fullName: string | null;
    taxId: string | null;
    line1: string;
    line2: string | null;
    city: string | null;
    subdivisionId: number | null;
    subdivisionName: string | null;
    postalCode: string | null;
    countryId: number;
    email: string;
    callingCode: string;
    mobile: string;
};

export class BillingAddress {
    readonly id: number;
    readonly orgId: number;
    readonly userId: number;
    readonly partyType: PartyType | null;
    readonly companyName: string | null;
    readonly fullName: string | null;
    readonly taxId: string | null;
    readonly line1: string;
    readonly line2: string | null;
    readonly city: string | null;
    readonly subdivisionId: number | null;
    readonly subdivisionName: string | null;
    readonly postalCode: string | null;
    readonly countryId: number;
    readonly email: string;
    readonly callingCode: string;
    readonly mobile: string;

    constructor(props: BillingAddressProps) {
        this.id = props.id;
        this.orgId = props.orgId;
        this.userId = props.userId;
        this.partyType = props.partyType;
        this.companyName = props.companyName;
        this.fullName = props.fullName;
        this.taxId = props.taxId;
        this.line1 = props.line1;
        this.line2 = props.line2;
        this.city = props.city;
        this.subdivisionId = props.subdivisionId;
        this.subdivisionName = props.subdivisionName;
        this.postalCode = props.postalCode;
        this.countryId = props.countryId;
        this.email = props.email;
        this.callingCode = props.callingCode;
        this.mobile = props.mobile;
    }

    static fromJson(json: JsonObj): BillingAddress {
        return new BillingAddress({
            id: json.id,
            orgId: json.orgId,
            userId: json.userId,
            partyType: PartyType.fromValue(json.partyType),
            companyName: json.companyName,
            fullName: json.fullName,
            taxId: json.taxId,
            line1: json.line1,
            line2: json.line2,
            city: json.city,
            subdivisionId: json.subdivisionId,
            subdivisionName: json.subdivisionName,
            postalCode: json.postalCode,
            countryId: json.countryId,
            email: json.email,
            callingCode: json.callingCode,
            mobile: json.mobile
        });
    }
}
