import { CurrentURL } from "./CurrentURL";

export type BaseEnvProps = {
    tenant: string;
    apiSchema: string;
    apiHost: string;
    apiPort: string;
    pyBackendUrl: string;
    mainUrl: string;
}

export class BaseEnv {

    private static readonly _main_ = "_main_";
    private static readonly _runtime_ = "_runtime_";

    readonly tenant?: string;
    readonly apiSchema: string;
    readonly apiHost: string;
    readonly apiPort: string;
    readonly pyBackendUrl: string;
    readonly mainUrl: string;

    private static _instance: BaseEnv | null = null;

    private constructor(props: BaseEnvProps) {
        this.tenant = props.tenant;
        this.apiSchema = props.apiSchema;
        this.apiHost = props.apiHost;
        this.apiPort = props.apiPort;
        this.pyBackendUrl = props.pyBackendUrl;
        this.mainUrl = props.mainUrl;
    }

    get apiBase(): string {
        return `${this.apiSchema}://${this.apiHost}:${this.apiPort}`;
    }

    static get instance(): BaseEnv {
        if (!BaseEnv._instance) {
            throw new Error('BaseEnv not initialized. Call loadEnv() first.');
        }
        return BaseEnv._instance!;
    }

    static async loadFromFile(url: string = "/web/env.json"): Promise<BaseEnv> {
        // Build a base URL from Vite's BASE_URL (e.g. "/web/")
        const viteBase = (import.meta as any)?.env?.BASE_URL as string | undefined;
        const base = new URL(viteBase ?? "/", window.location.origin);

        // If caller passed an absolute URL (with scheme), use it as-is
        const isAbsolute = /^https?:\/\//i.test(url);

        // Otherwise, resolve RELATIVE to the base. Strip any leading slash.
        const relPath = isAbsolute ? url : url.replace(/^\//, "");
        const resolved = isAbsolute ? new URL(url) : new URL(relPath, base);

        // Add cache-buster
        resolved.searchParams.set("t", String(Date.now()));

        // Fetch + parse
        const response = await fetch(resolved.toString());
        if (!response.ok) {
            throw new Error(`Failed to load env file: ${response.status} ${response.statusText}`);
        }
        const json = await response.json();

        // Tenant resolution
        const currentURL = CurrentURL.fromURL(window.location.href);
        let rawTenant = json.tenant;
        console.log(`Raw tenant: ${rawTenant}`);
        let resolvedTenant = null;
        if (rawTenant == this._main_) {
            resolvedTenant = null;
        } else if (rawTenant == this._runtime_) {
            if (currentURL.subdomain == null || currentURL.subdomain === "") {
                throw new Error('Subdomain is required for runtime tenant');
            } else {
                resolvedTenant = currentURL.subdomain;
            }
        } else {
            resolvedTenant = rawTenant;
        }
        console.log(`Resolved tenant: ${resolvedTenant}`);

        BaseEnv._instance = new BaseEnv({
            tenant: resolvedTenant,
            apiSchema: json.apiSchema,
            apiHost: json.apiHost,
            apiPort: json.apiPort,
            pyBackendUrl: json.pyBackendUrl,
            mainUrl: json.mainUrl,
        });

        return BaseEnv._instance!;
    }


    get isMainSite(): boolean {
        return this.tenant === null;
    }


}