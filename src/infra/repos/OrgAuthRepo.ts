import { SignUpInitReq, SignUpInitRes } from "~/domain/main/auth/models/SignUpInitModels";
import { PreSignUpData } from "~/domain/main/auth/models/PreSignUpData";
import { SignUpFinishSetupReq, SignUpFinishSetupRes } from "~/domain/main/auth/models/FinishSetupModels";
import { SignUpSendCodeReq, SignUpSendCodeRes } from "~/domain/main/auth/models/SignUpSendCodeModels";
import { SignUpVerifyCodeReq, SignUpVerifyCodeRes } from "~/domain/main/auth/models/VerifyCodeModels";
import { BaseApiClient } from "../datasources/BaseApiClient";
import { ResEither } from "~/core/utils/ResEither";
import { ApiError } from "../errors/ApiError";

export class OrgAuthRepo {

    private readonly apiClient: BaseApiClient;

    constructor(apiClient: BaseApiClient) {
        this.apiClient = apiClient;
    }

    baseUrl(path: string): string {
        return `/api/v1/orgs/auth${path}`;
    }

    public async signUpInit(req: SignUpInitReq): Promise<ResEither<ApiError, SignUpInitRes>> {
        try {
            const response = await this.apiClient.axios.post(this.baseUrl("/signup/initiate"), req);
            const signUpInitRes = SignUpInitRes.fromJson(response.data);
            return ResEither.data(signUpInitRes);
        } catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    public async getPreSignUpData(): Promise<ResEither<ApiError, PreSignUpData>> {
        try {
            const response = await this.apiClient.axios.get(this.baseUrl("/signup/pre-signup-data"));
            return ResEither.data(response.data as PreSignUpData);
        } catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    public async signUpSendCode(req: SignUpSendCodeReq): Promise<ResEither<ApiError, SignUpSendCodeRes>> {
        try {
            const response = await this.apiClient.axios.post(this.baseUrl("/signup/send-code"), req.toJson());
            const sendCodeRes = SignUpSendCodeRes.fromJson(response.data);
            return ResEither.data(sendCodeRes);
        } catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    public async signUpVerifyCode(req: SignUpVerifyCodeReq): Promise<ResEither<ApiError, SignUpVerifyCodeRes>> {
        try {
            const response = await this.apiClient.axios.post(this.baseUrl("/signup/verify-code"), req.toJson());
            const verifyCodeRes = SignUpVerifyCodeRes.fromJson(response.data);
            return ResEither.data(verifyCodeRes);
        } catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    public async signUpFinishSetup(req: SignUpFinishSetupReq): Promise<ResEither<ApiError, SignUpFinishSetupRes>> {
        try {
            const response = await this.apiClient.axios.post(this.baseUrl("/signup/finish"), req.toJson());
            const finishSetupRes = SignUpFinishSetupRes.fromJson(response.data);
            return ResEither.data(finishSetupRes);
        } catch (error) {
            const apiError = ApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }
}