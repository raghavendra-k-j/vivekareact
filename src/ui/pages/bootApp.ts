import { AppEnv } from "~/core/config/AppEnv";
import { BaseEnv } from "~/core/config/BaseEnv";
import { logger } from "~/core/utils/logger";
import { AuthService } from "~/domain/auth/services/AuthService";
import { OrgConfig } from "~/domain/common/models/OrgConfig";
import { ConfigService } from "~/domain/common/services/ConfigService";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { BaseApiClient } from "~/infra/datasources/BaseApiClient";
import { AuthRepo } from "~/infra/repos/AuthRepo";

let hasBooted = false;
let orgConfigData: OrgConfig | null = null;
let configService: ConfigService | null = null;
let authService: AuthService | null = null;

export async function bootApp(): Promise<void> {
    if (hasBooted) return;
    logger.debug("Booting app...");

    const appEnv = AppEnv.fromBaseEnv(BaseEnv.instance);
    ApiClient.createInstace({ baseURL: appEnv.apiBase });

    configService = new ConfigService();
    orgConfigData = (await configService.getOrgConfig(appEnv.tenant)).data;

    authService = new AuthService(new AuthRepo(ApiClient.findInstance()));

    hasBooted = true;
}

export function getOrgConfig(): OrgConfig {
    if (!orgConfigData) {
        throw new Error("OrgConfig is not initialized. Call bootApp() first.");
    }
    return orgConfigData;
}


export function getConfigService(): ConfigService {
    if (!configService) {
        configService = new ConfigService();
    }
    return configService;
}

export function getAuthService(): AuthService {
    if (!authService) {
        throw new Error("AuthService is not initialized. Call bootApp() first.");
    }
    return authService;
}