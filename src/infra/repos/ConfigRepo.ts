import { ResEither } from "~/core/utils/ResEither";
import { BaseApiClient } from "../datasources/BaseApiClient";
import { ApiError } from "../errors/ApiError";
import { OrgConfig } from "~/domain/common/models/OrgConfig";
import type { AxiosInstance } from "axios";
import { PlanAndUsage } from "~/domain/common/models/PlanAndUsage";
import { ApiClient } from "../datasources/ApiClient";

export class ConfigRepo {
    private baseApiClient: BaseApiClient;
    private apiClient: ApiClient;


    private get baseAxios(): AxiosInstance {
        return this.baseApiClient.axios;
    }

    private get apiClientAxios(): AxiosInstance {
        return this.apiClient.axios;
    }

    constructor() {
        this.baseApiClient = BaseApiClient.findInstance();
        this.apiClient = ApiClient.findInstance();
    }

    public async getOrgConfig(subdomain: string): Promise<ResEither<ApiError, OrgConfig>> {
        try {
            const response = await this.baseAxios.post("/api/v1/config/startup", {
                subdomain: subdomain
            });
            const orgConfig = OrgConfig.fromJson(response.data);
            return ResEither.data(orgConfig);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    public async getPlanAndUsage(): Promise<ResEither<ApiError, PlanAndUsage>> {
        try {
            const response = await this.apiClientAxios.get("/api/v1/config/plan");
            const planAndUsage = PlanAndUsage.fromJson(response.data);
            return ResEither.data(planAndUsage);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }


}