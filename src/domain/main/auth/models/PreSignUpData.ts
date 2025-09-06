import { JsonObj } from "~/core/types/Json";
import { CallingCode } from "~/domain/common/models/CallingCode";
import { OrgType } from "~/domain/org/models/OrgType";

export class ValidationData {
    personNameMinLength: number;
    personNameMaxLength: number;
    emailMinLength: number;
    emailMaxLength: number;
    passwordMinLength: number;
    passwordMaxLength: number;
    otpLength: number;
    orgNameMinLength: number;
    orgNameMaxLength: number;
    subdomainMinLength: number;
    subdomainMaxLength: number;
    customOrgTypeMinLength: number;
    customOrgTypeMaxLength: number;

    constructor(props: {
        personNameMinLength: number;
        personNameMaxLength: number;
        emailMinLength: number;
        emailMaxLength: number;
        passwordMinLength: number;
        passwordMaxLength: number;
        otpLength: number;
        orgNameMinLength: number;
        orgNameMaxLength: number;
        subdomainMinLength: number;
        subdomainMaxLength: number;
        customOrgTypeMinLength: number;
        customOrgTypeMaxLength: number;
    }) {
        this.personNameMinLength = props.personNameMinLength;
        this.personNameMaxLength = props.personNameMaxLength;
        this.emailMinLength = props.emailMinLength;
        this.emailMaxLength = props.emailMaxLength;
        this.passwordMinLength = props.passwordMinLength;
        this.passwordMaxLength = props.passwordMaxLength;
        this.otpLength = props.otpLength;
        this.orgNameMinLength = props.orgNameMinLength;
        this.orgNameMaxLength = props.orgNameMaxLength;
        this.subdomainMinLength = props.subdomainMinLength;
        this.subdomainMaxLength = props.subdomainMaxLength;
        this.customOrgTypeMinLength = props.customOrgTypeMinLength;
        this.customOrgTypeMaxLength = props.customOrgTypeMaxLength;
    }

    static fromJson(json: JsonObj): ValidationData {
        return new ValidationData({
            personNameMinLength: json.personNameMinLength,
            personNameMaxLength: json.personNameMaxLength,
            emailMinLength: json.emailMinLength,
            emailMaxLength: json.emailMaxLength,
            passwordMinLength: json.passwordMinLength,
            passwordMaxLength: json.passwordMaxLength,
            otpLength: json.otpLength,
            orgNameMinLength: json.orgNameMinLength,
            orgNameMaxLength: json.orgNameMaxLength,
            subdomainMinLength: json.subdomainMinLength,
            subdomainMaxLength: json.subdomainMaxLength,
            customOrgTypeMinLength: json.customOrgTypeMinLength,
            customOrgTypeMaxLength: json.customOrgTypeMaxLength,
        });
    }
}

export class PreSignUpData {
    callingCodes: CallingCode[];
    orgTypes: OrgType[];
    validationData: ValidationData;
    otherOrgType: string;

    constructor(props: { callingCodes: CallingCode[]; orgTypes: OrgType[]; validationData: ValidationData, otherOrgType: string }) {
        this.callingCodes = props.callingCodes;
        this.orgTypes = props.orgTypes;
        this.validationData = props.validationData;
        this.otherOrgType = props.otherOrgType;
    }

    static fromJson(json: JsonObj): PreSignUpData {
        return new PreSignUpData({
            callingCodes: json.callingCodes.map((cc: JsonObj) => CallingCode.fromJson(cc)),
            orgTypes: json.orgTypes.map((ot: JsonObj) => OrgType.fromJson(ot)),
            validationData: ValidationData.fromJson(json.validationData),
            otherOrgType: json.otherOrgType,
        });
    }

}