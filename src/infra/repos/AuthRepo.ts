import { AuthConst } from "~/core/const/AuthConst";
import { ResEither } from "~/core/utils/ResEither";
import { AutoLoginRes } from "~/domain/auth/models/AutoLoginRes";
import { SoftLoginRes } from "~/domain/auth/models/SoftLoginRes";
import { EmailOtpStatus } from "~/domain/common/models/EmailOtpStatus";
import { ApiClient } from "../datasources/ApiClient";
import { ApiError } from "../errors/ApiError";

export class AuthRepo {

    private readonly apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async softLogin(accessToken: string): Promise<ResEither<ApiError, SoftLoginRes>> {
        try {
            const res = await this.apiClient.axios.post("/api/v1/auth/soft-login", {
                [AuthConst.keyAccessToken]: accessToken,
            });
            const authRes = SoftLoginRes.fromJson(res.data);
            return ResEither.data(authRes);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async checkAuthEmailOTPStatus(otpId: number): Promise<ResEither<ApiError, EmailOtpStatus | null>> {
        try {
            const res = await this.apiClient.axios.get(`/api/v1/auth/email-otp/${otpId}/status`);
            if (!res.data || typeof res.data === "string") return ResEither.data(null);
            const resData = EmailOtpStatus.fromJson(res.data);
            return ResEither.data(resData);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }


    async autoLogin({ tempAuthToken, userId }: { tempAuthToken: string, userId: number }): Promise<ResEither<ApiError, AutoLoginRes>> {
        try {
            const res = await this.apiClient.axios.post("/api/v1/auth/auto-login", {
                [AuthConst.keyTempAuthTokenParam]: tempAuthToken,
                [AuthConst.keyUserId]: userId,
            });
            const autoLoginRes = AutoLoginRes.fromJson(res.data);
            return ResEither.data(autoLoginRes);
        }
        catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

}