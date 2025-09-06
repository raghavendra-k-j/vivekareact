import { JsonObj } from "../types/Json";
import { normalizeBaseUrl } from "../utils/url_utils";
import { CurrentURL } from "./CurrentURL";

// Environment Configuration related to base application (Main Site and Tenant Apps)


export class BaseEnv {

    private static readonly _main_ = "_main_";
    private static readonly _runtime_ = "_runtime_";

    readonly tenant: string | null;
    readonly websiteBaseUrl: string;
    readonly apiUrl: string;
    readonly pyApiUrl: string;
    readonly mainSiteUrl: string;
    readonly privacyPolicyUrl: string;
    readonly termsOfServiceUrl: string;
    readonly contactUsUrl: string;
    readonly aboutUsUrl: string;
    readonly primaryEmail?: string;
    readonly parentCompanyName: string;
    readonly parentCompanyUrl: string;
    readonly parentCompanyLogoUrl: string;
    readonly productName: string;
    readonly tawkToPropertyUrl: string;
    readonly logoText: string;
    readonly rootDomain: string;

    private static _instance: BaseEnv | null = null;

    private constructor(props: {
        tenant: string | null;
        websiteBaseUrl: string;
        apiUrl: string;
        pyApiUrl: string;
        mainSiteUrl: string;
        privacyPolicyUrl: string;
        termsOfServiceUrl: string;
        contactUsUrl: string;
        aboutUsUrl: string;
        primaryEmail?: string;
        parentCompanyName: string;
        parentCompanyUrl: string;
        parentCompanyLogoUrl: string;
        productName: string;
        tawkToPropertyUrl: string;
        logoText: string;
        rootDomain: string;
    }) {
        this.tenant = props.tenant;
        this.websiteBaseUrl = props.websiteBaseUrl;
        this.apiUrl = props.apiUrl;
        this.pyApiUrl = props.pyApiUrl;
        this.mainSiteUrl = props.mainSiteUrl;
        this.privacyPolicyUrl = props.privacyPolicyUrl;
        this.termsOfServiceUrl = props.termsOfServiceUrl;
        this.contactUsUrl = props.contactUsUrl;
        this.aboutUsUrl = props.aboutUsUrl;
        this.primaryEmail = props.primaryEmail;
        this.parentCompanyName = props.parentCompanyName;
        this.parentCompanyUrl = props.parentCompanyUrl;
        this.parentCompanyLogoUrl = props.parentCompanyLogoUrl;
        this.productName = props.productName;
        this.tawkToPropertyUrl = props.tawkToPropertyUrl;
        this.logoText = props.logoText;
        this.rootDomain = props.rootDomain;
    }

    static get instance(): BaseEnv {
        if (!BaseEnv._instance) {
            throw new Error('BaseEnv not initialized. Call loadFromFile() first.');
        }
        return BaseEnv._instance!;
    }

    private static getNormalizedBase(): string {
        const viteBase: string | undefined = import.meta.env.BASE_URL;
        console.log(`Vite BASE_URL: '${viteBase}'`);
        const base = viteBase && viteBase.trim() !== "" ? viteBase : "/";
        return base.endsWith("/") ? base : base + "/";
    }


    /** Build the final URL to env.json (adds cache buster). */
    private static getUrls(url: string = "/env.json"): { envJsonUrl: URL, websiteBaseUrl: string } {
        const base = this.getNormalizedBase();
        const baseUrl = new URL(base, window.location.origin);
        const isAbsolute = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(url);
        const relPath = isAbsolute ? url : url.replace(/^\//, "");
        const resolved = isAbsolute ? new URL(url) : new URL(relPath, baseUrl);
        resolved.searchParams.set("t", String(Date.now()));
        console.log(`Loading env from: ${resolved.toString()}`);
        const websiteBaseUrl = normalizeBaseUrl(baseUrl.toString());
        return {
            envJsonUrl: resolved,
            websiteBaseUrl: websiteBaseUrl
        };
    }

    private static async fetchEnvJson(resolved: URL): Promise<any> {
        const response = await fetch(resolved.toString());
        if (!response.ok) {
            throw new Error(
                `Failed to load env file: ${response.status} ${response.statusText}`
            );
        }
        return response.json();
    }

    private static resolveTenant(rawTenant: string): string | null {
        const currentURL = CurrentURL.fromURL(window.location.href);
        if (rawTenant === this._main_) return null;

        if (rawTenant === this._runtime_) {
            if (!currentURL.subdomain) {
                throw new Error("Subdomain is required for runtime tenant");
            }
            return currentURL.subdomain;
        }
        return rawTenant;
    }

    private static mapProps({ json, tenant, websiteBaseUrl }: { json: JsonObj, tenant: string | null, websiteBaseUrl: string }) {
        return {
            tenant: tenant,
            websiteBaseUrl: websiteBaseUrl,
            apiUrl: normalizeBaseUrl(json.apiUrl),
            pyApiUrl: normalizeBaseUrl(json.pyBackendUrl),
            mainSiteUrl: normalizeBaseUrl(json.mainUrl),
            privacyPolicyUrl: json.privacyPolicyUrl,
            termsOfServiceUrl: json.termsOfServiceUrl,
            contactUsUrl: json.contactUsUrl,
            aboutUsUrl: json.aboutUsUrl,
            primaryEmail: json.primaryEmail,
            parentCompanyName: json.parentCompanyName,
            parentCompanyUrl: json.parentCompanyUrl,
            parentCompanyLogoUrl: json.parentCompanyLogoUrl,
            productName: json.productName,
            tawkToPropertyUrl: json.tawkToPropertyUrl,
            logoText: json.logoText,
            rootDomain: json.rootDomain,
        };
    }

    static async loadFromFile(): Promise<BaseEnv> {
        const { envJsonUrl, websiteBaseUrl } = this.getUrls();
        const json = await this.fetchEnvJson(envJsonUrl);
        const resolvedTenant = this.resolveTenant(json.tenant);
        const props = this.mapProps({ json: json, tenant: resolvedTenant, websiteBaseUrl: websiteBaseUrl });
        BaseEnv._instance = new BaseEnv(props);
        return BaseEnv._instance!;
    }

    get isMainSite(): boolean {
        return this.tenant === null;
    }

}