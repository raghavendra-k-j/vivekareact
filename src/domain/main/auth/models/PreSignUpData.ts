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
            customOrgTypeMaxLength: json.customOrgTypeMaxLength,
        });
    }
}


export class PreSignUpData {
    callingCodes: CallingCode[];
    orgTypes: OrgType[];
    validationData: ValidationData;

    constructor(props: { callingCodes: CallingCode[]; orgTypes: OrgType[]; validationData: ValidationData }) {
        this.callingCodes = props.callingCodes;
        this.orgTypes = props.orgTypes;
        this.validationData = props.validationData;
    }
}