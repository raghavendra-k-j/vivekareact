
import axios from "axios";
import { BaseEnv } from "~/core/config/BaseEnv";
import { ResEither } from "~/core/utils/ResEither";
import { PyApiError } from "~/infra/errors/PyApiError";
import { QuestionPaper } from "~/domain/qp/models/QuestionPaper";

export class QPGenService {

    baseEnv: BaseEnv;

    constructor() {
        this.baseEnv = BaseEnv.instance;
    }

    get baseUrl(): string {
        return this.baseEnv.pyBackendUrl;
    }

    async generateQuestionPaper({ userPrompt }: { userPrompt: string }): Promise<ResEither<PyApiError, QuestionPaper>> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/v1/question-papers/generate`, {
                'user_prompt': userPrompt
            });
            const paper = QuestionPaper.fromJson(response.data);
            return ResEither.data(paper);
        }
        catch (error) {
            const apiError = PyApiError.fromAny(error);
            return ResEither.error(apiError);
        }
    }

}
