import { JsonObj } from "~/core/types/Json";

export class MobileNumber {

    callingCode: string;
    mobileNumber: string;

    constructor(countryCode: string, mobileNumber: string) {
        this.callingCode = countryCode;
        this.mobileNumber = mobileNumber;
    }


    toJson() {
        return {
            callingCode: this.callingCode,
            mobileNumber: this.mobileNumber,
        };
    }

    static fromJson(mobile: JsonObj): MobileNumber | null {
        if (!mobile) return null;
        return new MobileNumber(mobile.callingCode, mobile.mobileNumber);
    }

}