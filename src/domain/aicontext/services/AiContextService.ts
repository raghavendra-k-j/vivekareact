
import axios from "axios";
import { BaseEnv } from "~/core/config/BaseEnv";
import { ResEither } from "~/core/utils/ResEither";
import { PyApiError } from "~/infra/errors/PyApiError";
import { UploadAiContextRes } from "../models/UploadAiContextModels";

export class AiContextService {
    

    baseEnv: BaseEnv;

    constructor() {
        this.baseEnv = BaseEnv.instance;
    }

    get baseUrl(): string {
        return this.baseEnv.pyBackendUrl;
    }

    async extractAIContext(fileUrl: string): Promise<ResEither<PyApiError, string>> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/v1/aicontext/extract`, {
                'file_url': fileUrl
            });
            return ResEither.data(response.data);
        }
        catch (error) {
            const apiError = PyApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async uploadAIContext(file: File | Blob): Promise<ResEither<PyApiError, UploadAiContextRes>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${this.baseUrl}/api/v1/aicontext/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return ResEither.data(UploadAiContextRes.fromJson(response.data));
        }
        catch (error) {
            const apiError = PyApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

    async copyFileFromURL(fileUrl: string): Promise<ResEither<PyApiError, string>> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/v1/aicontext/copy`, {
                'file_url': fileUrl
            });
            return ResEither.data(response.data);
        }
        catch (error) {
            const apiError = PyApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

}
