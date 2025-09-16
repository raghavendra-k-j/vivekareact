import { JsonObj } from "~/core/types/Json";

export class OrgGeneralSettingsRes {
    

    orgName: string;
    subdomain: string;
    logoUrl: string | null;
    validationData: OrgSettingsValidationData;

    constructor(params: { orgName: string; subdomain: string; logoUrl: string | null, validationData: OrgSettingsValidationData }) {
        this.orgName = params.orgName;
        this.subdomain = params.subdomain;
        this.logoUrl = params.logoUrl;
        this.validationData = params.validationData;
    }

    static fromJson(json: JsonObj): OrgGeneralSettingsRes {
        return new OrgGeneralSettingsRes({
            orgName: String(json.orgName),
            subdomain: String(json.subdomain),
            logoUrl: json.logoUrl ? String(json.logoUrl) : null,
            validationData: OrgSettingsValidationData.fromJson(json.validationData),
        });
    }

}

export class OrgSettingsValidationData {
    orgNameMinLength: number;
    orgNameMaxLength: number;
    logoMaxSizeInBytes: number;
    logoAllowedExtensions: string[];

    constructor(params: { orgNameMinLength: number; orgNameMaxLength: number, logoMaxSizeInBytes: number, logoAllowedExtensions: string[] }) {
        this.orgNameMinLength = params.orgNameMinLength;
        this.orgNameMaxLength = params.orgNameMaxLength;
        this.logoMaxSizeInBytes = params.logoMaxSizeInBytes;
        this.logoAllowedExtensions = params.logoAllowedExtensions;
    }

    static fromJson(json: JsonObj): OrgSettingsValidationData {
        return new OrgSettingsValidationData({
            orgNameMinLength: Number(json.orgNameMinLength),
            orgNameMaxLength: Number(json.orgNameMaxLength),
            logoMaxSizeInBytes: Number(json.logoMaxSizeInBytes),
            logoAllowedExtensions: Array.isArray(json.logoAllowedExtensions) ? json.logoAllowedExtensions.map(String) : [],
        });
    }

}


export class SaveGeneralSettingsReq {
    orgName: string;

    constructor(params: { orgName: string }) {
        this.orgName = params.orgName;
    }

    toJson(): JsonObj {
        return {
            orgName: this.orgName,
        };
    }
}