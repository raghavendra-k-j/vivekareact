import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { StrUtils } from "~/core/utils/StrUtils";
import { QPGenService } from "~/domain/qp/services/QPGenService";
import { DataState } from "~/ui/utils/DataState";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { QuestionPaper } from "../../../../domain/qp/models/QuestionPaper";
import { Section } from "../../../../domain/qp/models/Section";
import { InputSourceStore } from "./InputSourceStore";
import { AiContextService } from "~/domain/aicontext/services/AiContextService";
import { logger } from "~/core/utils/logger";
import { withMinDelay } from "~/infra/utils/withMinDelay";

export class QPGenPageStore {

    qpGenState: DataState<QuestionPaper> = DataState.init();
    qpGenService: QPGenService;
    aiContextService: AiContextService;
    inputStore: InputSourceStore;

    constructor() {
        this.qpGenService = new QPGenService();
        this.aiContextService = new AiContextService();
        this.inputStore = new InputSourceStore({ storeRef: this });
        makeObservable(this, {
            qpGenState: observable.ref,
        });
    }


    get qp(): QuestionPaper {
        return this.qpGenState.data!;
    }

    get sections(): Section[] {
        return this.qp.sections;
    }

    async generatePaper(): Promise<void> {
        logger.debug("Generating question paper with input source:", this.inputStore.inputSourceVm);
        if (this.qpGenState.isLoading) return;

        let context = null;
        if (this.inputStore.inputSourceVm !== null) {
            context = StrUtils.trimToNull(this.inputStore.inputSourceVm.content);
        }

        if (context === null) {
            showErrorToast({
                message: "Please upload a file or paste the content."
            });
            return;
        }

        let description = StrUtils.trimToNull(this.inputStore.descriptionField.value);
        if (description === null) {
            showErrorToast({
                message: "Please describe your question paper pattern."
            });
            return;
        }

        try {
            runInAction(() => {
                this.qpGenState = DataState.loading();
            });

            let userPrompt = '';
            userPrompt += `Context: ${context}\n\n\n\n\n\n\n\n\n\n\n`;
            userPrompt += `Details: ${description}\n`;

            const qpRes = await withMinDelay(
                this.qpGenService.generateQuestionPaper({ userPrompt: userPrompt }),
                1000
            );
            const qp = qpRes.getOrError();
            runInAction(() => {
                this.qpGenState = DataState.data(qp);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.qpGenState = DataState.error(appError);
            });
        }
    }

}