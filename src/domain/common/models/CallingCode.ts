import { JsonObj } from "~/core/types/Json";

export class CallingCode {
    callingCode: string;
    country: string;
    mobileMinLength: number;
    mobileMaxLength: number;

    constructor(props: {
        callingCode: string;
        country: string;
        mobileMinLength: number;
        mobileMaxLength: number;
    }) {
        this.callingCode = props.callingCode;
        this.country = props.country;
        this.mobileMinLength = props.mobileMinLength;
        this.mobileMaxLength = props.mobileMaxLength;
    }

    static fromJson(json: JsonObj): CallingCode {
        return new CallingCode({
            callingCode: json.callingCode,
            country: json.country,
            mobileMinLength: json.mobileMinLength,
            mobileMaxLength: json.mobileMaxLength,
        });
    }

}