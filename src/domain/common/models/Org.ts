import { JsonObj } from "~/core/types/Json";

export type OrgProps = {
    id: number;
    subdomain: string;
    name: string;
    logoUrl: string | null;
    createdAt: Date;
};

export class Org {
    readonly id: number;
    readonly subdomain: string;
    readonly name: string;
    logoUrl: string | null;
    readonly createdAt: Date;

    constructor(props: OrgProps) {
        this.id = props.id;
        this.subdomain = props.subdomain;
        this.name = props.name;
        this.logoUrl = props.logoUrl;
        this.createdAt = props.createdAt;
    }

    get hasLogoUrl(): boolean {
        return this.logoUrl !== null;
    }

    setLogoUrl(url: string | null): void {
        this.logoUrl = url;
    }

    public static fromJson(json: JsonObj): Org {
        return new Org({
            id: json.id,
            subdomain: json.subdomain,
            name: json.name,
            logoUrl: json.logoUrl,
            createdAt: new Date(json.createdAt),
        });
    }
}