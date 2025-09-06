import type { BaseEnv } from "./BaseEnv";
import { CurrentURL } from "./CurrentURL";

// Environment Configuration related to tenant application

export type AppEnvProps = {
    tenant: string;
    apiUrl: string;
    pyApiUrl: string;
    webBase: string;
};

export type AppEnvJson = AppEnvProps;

export class AppEnv {
    readonly tenant: string;
    readonly apiUrl: string;
    readonly pyApiUrl: string;
    readonly webBase: string;

    public static instance: AppEnv;

    constructor(props: AppEnvProps) {
        this.tenant = props.tenant;
        this.apiUrl = props.apiUrl;
        this.pyApiUrl = props.pyApiUrl;
        this.webBase = props.webBase;
    }

    static fromBaseEnv(baseEnv: BaseEnv): AppEnv {
        const currentURL = CurrentURL.fromURL(window.location.href);
        const instance = new AppEnv({
            tenant: baseEnv.tenant!,
            apiUrl: baseEnv.apiUrl,
            pyApiUrl: baseEnv.pyApiUrl,
            webBase: currentURL.webBase
        });
        this.instance = instance;
        return instance;
    }
}

