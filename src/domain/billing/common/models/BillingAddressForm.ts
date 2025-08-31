import { JsonObj } from "~/core/types/Json";

export type BillingAddressFormProps = {
    companyName: string | null;
    fullName: string;
    taxId: string | null;

    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    subDivisionId: number;
    countryId: number;

    email: string;
    phone: string;
}


export class BillingAddressForm {

    companyName: string | null;
    fullName: string;
    taxId: string | null;

    line1: string;
    line2: string;
    city: string;
    postalCode: string;
    subDivisionId: number | null;
    countryId: number | null;

    email: string;
    phone: string;

    constructor(props: BillingAddressFormProps) {
        this.companyName = props.companyName;
        this.fullName = props.fullName;
        this.taxId = props.taxId;

        this.line1 = props.line1;
        this.line2 = props.line2;
        this.city = props.city;
        this.postalCode = props.postalCode;
        this.subDivisionId = props.subDivisionId;
        this.countryId = props.countryId;

        this.email = props.email;
        this.phone = props.phone;
    }

    toJson(): JsonObj {
        return {
            companyName: this.companyName,
            fullName: this.fullName,
            taxId: this.taxId,

            line1: this.line1,
            line2: this.line2,
            city: this.city,
            postalCode: this.postalCode,
            subDivisionId: this.subDivisionId,
            countryId: this.countryId,

            email: this.email,
            phone: this.phone
        };
    }
}
