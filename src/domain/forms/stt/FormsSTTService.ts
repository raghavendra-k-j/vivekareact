import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { ApiError } from "~/infra/errors/ApiError";
import { AiEquationReq, AiEquationRes } from "./AiEquationModels";
import { AiFormatReq, AiFormatRes } from "./AiFormatSTTModels";


export class FormsSTTService {

    apiClient: ApiClient;


    constructor() {
        this.apiClient = ApiClient.findInstance();
    }

    get axios() {
        return this.apiClient.axios;
    }

    async generateEquation(req: AiEquationReq): Promise<ResEither<AppError, AiEquationRes>> {
        try {
            const res = await this.axios.post("/api/v1/forms/stt/equation/generate", req.toRequestBody());
            return ResEither.data(res.data);
        } catch (e) {
            const apiError = ApiError.fromAny(e);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }


    async format(req: AiFormatReq): Promise<ResEither<AppError, AiFormatRes>> {
        try {
            const res = await this.axios.post("/api/v1/forms/stt/format", req.toRequestBody());
            return ResEither.data(AiFormatRes.fromJson(res.data));
        } catch (e) {
            const apiError = ApiError.fromAny(e);
            const appError = AppError.fromAny(apiError);
            return ResEither.error(appError);
        }
    }
}
