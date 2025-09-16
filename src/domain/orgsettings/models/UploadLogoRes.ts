import { JsonObj } from "~/core/types/Json";

export class UploadLogoRes {

    logoUrl: string;

    constructor(params: { logoUrl: string }) {
        this.logoUrl = params.logoUrl;
    }
    static fromJson(json: JsonObj): UploadLogoRes {
        return new UploadLogoRes({
            logoUrl: String(json.logoUrl),
        });
    }
}