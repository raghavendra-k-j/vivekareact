import { JsonObj } from "~/core/types/Json";
import { PartyType } from "./PartyType";

export type SaveBillingAddressReqProps = {
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
}


export class SaveBillingAddressReq {
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


    constructor(data: SaveBillingAddressReqProps) {
        this.partyType = data.partyType;
        this.companyName = data.companyName;
        this.fullName = data.fullName;
        this.taxId = data.taxId;
        this.line1 = data.line1;
        this.line2 = data.line2;
        this.city = data.city;
        this.subdivisionId = data.subdivisionId;
        this.subdivisionName = data.subdivisionName;
        this.postalCode = data.postalCode;
        this.countryId = data.countryId;
        this.email = data.email;
        this.callingCode = data.callingCode;
        this.mobile = data.mobile;
    }

    toJson(): JsonObj {
        return {
            partyType: this.partyType.value,
            companyName: this.companyName,
            fullName: this.fullName,
            taxId: this.taxId,
            line1: this.line1,
            line2: this.line2,
            city: this.city,
            subdivisionId: this.subdivisionId,
            subdivisionName: this.subdivisionName,
            postalCode: this.postalCode,
            countryId: this.countryId,
            email: this.email,
            callingCode: this.callingCode,
            mobile: this.mobile,
        };
    }


}