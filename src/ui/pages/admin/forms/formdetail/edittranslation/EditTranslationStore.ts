import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { SaveTranslationReq } from "~/domain/forms/admin/models/translation/SaveTranslationReq";
import { FormType } from "~/domain/forms/models/FormType";
import { STT } from "~/infra/utils/stt/STT";
import { FormsComposerOptions } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsSTTDocOptions, FormsSTTLaTexOptions } from "~/ui/components/formssttdialog/models/FormatSTTOptions";
import { AppStore } from "~/ui/pages/_layout/AppStore";
import { FormsComposerOptionsUtil } from "~/ui/pages/common/forms/utils/FormsComposerUtil";
import { DataState } from "~/ui/utils/DataState";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { AdminFormStore } from "../layout/AdminFormStore";
import { FormTranslationVm } from "./models/FormTranslationVm";
import { GroupQuestionVm } from "./models/GroupQuestionVm";
import { QuestionVm } from "./models/QuestionVm";
import { QuestionVmUtil } from "./models/QuestionVmFactory";
import { Language } from "~/domain/forms/models/Language";

export type EditTranslationStoreProps = {
    appStore: AppStore;
    languageId: string;
    adminFormStore: AdminFormStore;
}

export class EditTranslationStore {

    _stt: STT | null = null;
    appStore: AppStore;
    languageId: string;
    adminFormStore: AdminFormStore;
    loadState: DataState<FormTranslationVm> = DataState.init();
    saveState: DataState<void> = DataState.init();


    isComposerOptionsInitialized = false;
    latexSTTOptions!: FormsSTTLaTexOptions;
    blockSTTOptions!: FormsSTTDocOptions;
    inlineSTTOptions!: FormsSTTDocOptions;
    blockComposerOptions!: FormsComposerOptions;
    inlineComposerOptions!: FormsComposerOptions;

    constructor(props: EditTranslationStoreProps) {
        this.appStore = props.appStore;
        this.languageId = props.languageId;
        this.adminFormStore = props.adminFormStore;
        makeObservable(this, {
            loadState: observable.ref,
            saveState: observable.ref,
        });
    }


    get planDetail() {
        return this.appStore.planDetail;
    }


    private initSTTAndComposerOptions(data: FormTranslationVm) {
        if(this.isComposerOptionsInitialized) return;

        const defaultLanguage = data.language;
        const languages = [defaultLanguage];
        // Always add English language if it's not the default
        if (defaultLanguage.id !== Language.ENGLISH.id) {
            languages.push(Language.ENGLISH);
        }

        const result = FormsComposerOptionsUtil.create({
            formId: this.fd.id,
            language: defaultLanguage,
            languages: languages,
            formType: this.formType,
            assmntDomain: this.fd.assmntDomain,
            allowAiSTTFormat: this.planDetail.formsAiEqnAdminEnabled,
        });

        this.blockSTTOptions = result.blockSTTOptions;
        this.inlineSTTOptions = result.inlineSTTOptions;
        this.latexSTTOptions = result.latexSTTOptions;
        this.blockComposerOptions = result.blockComposerOptions;
        this.inlineComposerOptions = result.inlineComposerOptions;
    }


    get stt(): STT {
        return this._stt!;
    }

    set stt(value: STT | null) {
        this._stt = value;
    }

    get optStt(): STT | null {
        return this._stt || null;
    }


    get data() {
        return this.loadState.data!;
    }

    get fd() {
        return this.adminFormStore.fd;
    }

    get formType(): FormType {
        return this.adminFormStore.fd.type;
    }

    get adminFormService() {
        return this.adminFormStore.adminFormService;
    }

    sendCloseDialogMessage() {
        window.parent.postMessage(JSON.stringify({ eventType: "closeDialog" }), "*");
    }

    async loadTranslation() {
        try {
            runInAction(() => this.loadState = DataState.loading());
            const res = await this.adminFormService.getTranslation(this.fd.id, this.languageId);
            const resData = res.getOrError();
            const data = FormTranslationVm.fromModel({
                model: resData,
                storeRef: this,
            });
            if(!this.isComposerOptionsInitialized) {
                this.initSTTAndComposerOptions(data);
            }
            runInAction(() => this.loadState = DataState.data(data));
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => this.loadState = DataState.error(appError));
        }
    }

    async saveTranslation() {
        const isValid = this.commitEditsAndValidate();
        if (!isValid) {
            showErrorToast({
                description: `Your translation contains errors. Review all questions and fields, correct the highlighted issues, and then save again`,
            });
            return;
        }
        try {
            if (this.saveState.isLoading) return;
            runInAction(() => this.saveState = DataState.loading());
            const questions = this.data.questions.map(q => QuestionVmUtil.toReq(q));
            const req = new SaveTranslationReq({
                formId: this.fd.id,
                translationId: this.data.translationId,
                languageId: this.languageId,
                title: this.data.title.value,
                description: this.data.description.value,
                questions: questions
            });
            const res = await this.adminFormService.saveTranslation(req);
            if (res.isError) throw res.getError();
            runInAction(() => this.saveState = DataState.data(undefined));
            this.sendCloseDialogMessage();
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => this.saveState = DataState.error(appError));
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }


    private processQuestion(q: QuestionVm): number {
        let errorCount = 0;

        if (q.isEdit) {
            q.commitEdits();
            if (!q.hasError) {
                q.isEdit = false;
            }
        }

        if (q.hasError) {
            errorCount++;
        }

        if (q.type.isGroup) {
            const groupVm = q as GroupQuestionVm;
            groupVm.subQuestions.forEach(subQ => {
                errorCount += this.processQuestion(subQ);
            });
        }

        return errorCount;
    };


    private commitEditsAndValidate(): boolean {
        let hasError = false;
        let totalErrorQuestions = 0;
        this.data.questions.forEach(q => {
            totalErrorQuestions += this.processQuestion(q);
        });

        // check for any errors in the title, description, and questions
        if (this.data.title.hasError) {
            hasError = true;
        }

        if (this.data.hasDescription && this.data.description.hasError) {
            hasError = true;
        }

        if (totalErrorQuestions > 0) {
            hasError = true;
        }

        return !hasError;
    }


}