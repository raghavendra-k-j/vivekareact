import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { logger } from "~/core/utils/logger";
import { NumFmt } from "~/core/utils/NumFmt";
import { ThingId } from "~/core/utils/ThingId";
import { GetQuestionRes } from "~/domain/forms/admin/models/GetQuestionRes";
import { MediaTileRefReq } from "~/domain/forms/admin/models/MediaTileRefReq";
import { UpsertQuestionReq } from "~/domain/forms/admin/models/UpsertQuestionModel";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { FormQuestionConst } from "~/domain/forms/const/FormQuestionConst";
import { FormType } from "~/domain/forms/models/FormType";
import { QuestionType } from "~/domain/forms/models/question/QuestionType";
import { waitForNextFrame } from "~/infra/utils/waitForNextFrame";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { showAppErrorDialog } from "~/ui/components/dialogs/showAppErrorDialog";
import { blockSchema } from "~/ui/components/formscomposer/core/schema";
import { FormsComposerOptions } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsComposerUtil } from "~/ui/components/formscomposer/utils/FormsComposerUtil";
import { FormsSTTDocOptions, FormsSTTLaTexOptions } from "~/ui/components/formssttdialog/models/FormatSTTOptions";
import { AppStore } from "~/ui/pages/_layout/AppStore";
import { FormsComposerOptionsUtil } from "~/ui/pages/common/forms/utils/FormsComposerUtil";
import { DataState } from "~/ui/utils/DataState";
import { DialogEntry, DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { AdminFormStore } from "../layout/AdminFormStore";
import { QMediaPicker, QMediaPickerProps } from "../qmediapicker/QMediaPicker";
import { UpsertQuestionVm } from "./models/UpsertQuestionVm";
import { UpsertQuestionVmFactory } from "./models/UpsertQuestionVmFactory";
import { Language } from "~/domain/forms/models/Language";

export type UpsertQuestionStoreProps = {
    id: number | null;
    parentId: number | null;
    formId: number;
    formType: FormType;
    adminFormsService: AdminFormsService;
    onClose: (questionNumber: number | null) => void;
    dialogManager: DialogManagerStore;
    appStore: AppStore;
    formStore: AdminFormStore;
}

export class UpsertQuestionStore {
    instanceId = ThingId.generate();

    id: number | null;
    parentId: number | null;
    formId: number;
    formType: FormType;
    adminFormsService: AdminFormsService;
    onClose: (questionNumber: number | null) => void;
    appStore: AppStore;
    formStore: AdminFormStore;

    qvmState: DataState<UpsertQuestionVm> = DataState.init();
    saveState: DataState<void> = DataState.init();
    dialogManager: DialogManagerStore;


    latexSTTOptions!: FormsSTTLaTexOptions;
    blockSTTOptions!: FormsSTTDocOptions;
    inlineSTTOptions!: FormsSTTDocOptions;
    blockComposerOptions!: FormsComposerOptions;
    inlineComposerOptions!: FormsComposerOptions;

    constructor(props: UpsertQuestionStoreProps) {
        this.id = props.id;
        this.parentId = props.parentId;
        this.onClose = props.onClose;
        this.adminFormsService = props.adminFormsService;
        this.formType = props.formType;
        this.formId = props.formId;
        this.dialogManager = props.dialogManager;
        this.appStore = props.appStore;
        this.formStore = props.formStore;

        this.initSTTAndComposerOptions();

        makeObservable(this, {
            qvmState: observable.ref,
            saveState: observable.ref,
        });
    }

    get planDetail() {
        return this.appStore.planDetail;
    }

    private initSTTAndComposerOptions() {
        const languages = this.formDetail.languages ?? [];
        const defaultLanguage = this.formDetail.language || Language.ENGLISH;

        const result = FormsComposerOptionsUtil.create({
            formId: this.formDetail.id,
            language: defaultLanguage,
            languages: languages,
            formType: this.formType,
            assmntDomain: this.formDetail.assmntDomain,
            allowAiSTTFormat: this.planDetail.formsAiEqnAdminEnabled,
        });

        this.blockSTTOptions = result.blockSTTOptions;
        this.inlineSTTOptions = result.inlineSTTOptions;
        this.latexSTTOptions = result.latexSTTOptions;
        this.blockComposerOptions = result.blockComposerOptions;
        this.inlineComposerOptions = result.inlineComposerOptions;
    }


    get vm() {
        return this.qvmState.data!;
    }

    get isEdit() {
        return this.id !== null;
    }

    get formDetail() {
        return this.formStore.fd;
    }

    get assmntDomain() {
        return this.formDetail.assmntDomain;
    }


    async loadQuestion() {
        if (this.id !== null) {
            await this.loadQuestionById(this.id);
        }
        else {
            await this.loadNewEmptyQuestion({});
        }
    }

    async loadQuestionById(id: number) {
        try {
            runInAction(() => {
                this.qvmState = DataState.loading();
            });
            await waitForNextFrame();
            const res = await withMinDelay(
                this.adminFormsService.getQuestionById({
                    formId: this.formId,
                    questionId: id,
                })
            );
            const question = res.getOrError();
            this.onQuestionLoaded(question);
        }
        catch (error) {
            logger.error("Error while loading question", error);
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.qvmState = DataState.error(appError);
            });
        }
    }


    onQuestionLoaded(res: GetQuestionRes) {
        const question = res.question;
        const vm = UpsertQuestionVmFactory.fromQuestion({
            question: question,
            storeRef: this,
        });
        runInAction(() => {
            this.qvmState = DataState.data(vm);
        });
    }

    get questionTypes(): readonly QuestionType[] {
        return QuestionType.getValues(this.formType);
    }


    onQuestionTypeChanged(type: QuestionType) {
        if (this.vm.id !== null) {
            logger.warn("Cannot change question type for an existing question");
            return;
        }
        this.loadNewEmptyQuestion({
            questionType: type,
        });
    }


    async loadNewEmptyQuestion(props: { questionType?: QuestionType }) {
        runInAction(() => {
            this.qvmState = DataState.loading();
        });
        const vm = UpsertQuestionVmFactory.empty({
            type: props.questionType || this.questionTypes[0],
            storeRef: this,
        });
        runInAction(() => {
            this.qvmState = DataState.data(vm);
        });
    }

    private getAnsHint(): string | null {
        return FormsComposerUtil.toTextFromRef({
            ref: this.vm.ansHintRef,
            schema: blockSchema,
        });
    }

    private getAnsExplanation(): string | null {
        return FormsComposerUtil.toTextFromRef({
            ref: this.vm.ansExplanationRef,
            schema: blockSchema,
        });
    }

    async saveQuestion() {
        if (this.saveState.isLoading) {
            return;
        }
        try {
            runInAction(() => {
                this.saveState = DataState.loading();
            });
            const req = this.getRequest();
            const res = (await this.adminFormsService.upsertQuestion(req)).getOrError();
            runInAction(() => {
                this.saveState = DataState.data(undefined);
                this.onClose(res.question.id);
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.saveState = DataState.error(appError);
            });
            showAppErrorDialog({
                dialogManager: this.dialogManager,
                dialogId: "upsert-question-error",
                appError: appError,
                primaryButton: {
                    text: "OK",
                    onClick: () => {
                        this.dialogManager.closeById("upsert-question-error");
                    },
                },
            });
        }
    }


    private getRequest() {
        const req = new UpsertQuestionReq({
            formId: this.formId,
            id: this.vm.id,
            parentId: this.parentId,
            type: this.vm.type.value!,
            question: this.qvmState.data?.getQuestionText() ?? "",
            qExtras: this.vm.enaVm?.getQExtra() || null,
            answer: this.vm.enaVm?.getAnswer() || null,
            ansHint: this.getAnsHint(),
            level: this.vm.level.value,
            ansExplanation: this.getAnsExplanation(),
            marks: this.vm.scorable.value.isTrue ? (NumFmt.toNumber(this.vm.marks.value) ?? null) : null,
            isRequired: this.vm.isRequired.value,
            mediaRefs: this.vm.mediaFiles.map((file) => new MediaTileRefReq({
                id: file.id,
                caption: file.caption || null,
            })),
        });
        return req;
    }


    handleOnAddMedia() {
        const entry: DialogEntry<QMediaPickerProps> = {
            id: "upsert-question-add-media",
            component: QMediaPicker,
            props: {
                onClose: () => {
                    this.dialogManager.closeById("upsert-question-add-media");
                },
                onSelect: (media) => {
                    this.dialogManager.closeById("upsert-question-add-media");
                    if (this.vm.mediaFiles.length >= FormQuestionConst.maxMediaFilesPerQuestion) {
                        showErrorToast({
                            message: "Media Limit Reached",
                            description: `You can only add up to ${FormQuestionConst.maxMediaFilesPerQuestion} media files per question.`,
                        });
                        return;
                    }
                    this.vm.addMediaFile(media);
                },
                appStore: this.appStore,
            }
        };
        this.dialogManager.show(entry);
    }


    sendCloseDialogMessage() {
        window.parent.postMessage(JSON.stringify({
            eventType: "closeDialog",
            questionId: this.id,
            parentId: this.parentId,
        }), "*");
    }

}