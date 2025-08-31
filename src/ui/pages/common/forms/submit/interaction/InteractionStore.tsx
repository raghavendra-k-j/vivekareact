import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { InstanceId } from "~/core/utils/InstanceId";
import { logger } from "~/core/utils/logger";
import type { FormType } from "~/domain/forms/models/FormType";
import { Language } from "~/domain/forms/models/Language";
import { SubmitFormReq, SubmitFormRes } from "~/domain/forms/models/submit/SubmitFormModels";
import { SubmitFormQuestion } from "~/domain/forms/models/SubmitFormQuestion";
import { STT } from "~/infra/utils/stt/STT";
import { SpeechVoice, TTS } from "~/infra/utils/tts/TTS";
import { showErrorDialog } from "~/ui/components/dialogs/showErrorDialog";
import { showLoadingDialog } from "~/ui/components/dialogs/showLoadingDialog";
import { FormsComposerOptions } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FormsSTTDocOptions, FormsSTTLaTexOptions } from "~/ui/components/formssttdialog/models/FormatSTTOptions";
import { DataState } from "~/ui/utils/DataState";
import { DialogEntry, DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { FormsComposerOptionsUtil } from "../../utils/FormsComposerUtil";
import type { SubmitStore } from "../SubmitStore";
import { QuitFormDialog, QuitFormDialogProps } from "./comp/QuitFormDialog";
import { SubmitConfirmDialog, SubmitConfirmDialogProps } from "./comp/SubmitConfirmDialog";
import { TimesUpDialog } from "./comp/TimesUpDialog";
import { GroupQuestionVm } from "./models/GroupQuestionVm";
import { InteractionVm } from "./models/InteractionVm";
import { QuestionVm } from "./models/QuestionVm";

type InteractionStoreProps = {
    parentStore: SubmitStore;
    dialogManager: DialogManagerStore;
};

export class InteractionStore {
    parentStore: SubmitStore;
    dialogManager: DialogManagerStore;

    vmState: DataState<InteractionVm>;
    startedOn!: Date;
    endedOn: Date | null = null;
    remainingSeconds: number = 0;
    private timer: ReturnType<typeof setInterval> | null = null;
    public readonly instanceId = InstanceId.generate("InteractionStore");

    _stt!: STT;
    submitState = DataState.init<SubmitFormRes>();

    _tts: TTS | null = null;
    ttsVoicesState: DataState<SpeechVoice[]> = DataState.init();
    currentTTSTag: string | null = null;

    // Pre-bind handlers
    private boundHandleTTSStart: (tag: string) => void;
    private boundHandleTTSEnd: (tag: string) => void;

    latexSTTOptions!: FormsSTTLaTexOptions;
    blockSTTOptions!: FormsSTTDocOptions;
    inlineSTTOptions!: FormsSTTDocOptions;
    blockComposerOptions!: FormsComposerOptions;
    inlineComposerOptions!: FormsComposerOptions;

    constructor(props: InteractionStoreProps) {
        logger.debug("Creating InteractionStore", this.instanceId);
        this.parentStore = props.parentStore;
        this.dialogManager = props.dialogManager;
        this.vmState = DataState.init<InteractionVm>();

        makeObservable(this, {
            vmState: observable.ref,
            remainingSeconds: observable,
            submitState: observable.ref,
            currentTTSTag: observable,
        });

        this.initSTTAndComposerOptions();

        this.boundHandleTTSStart = this.handleTTSStart.bind(this);
        this.boundHandleTTSEnd = this.handleTTSEnd.bind(this);
    }

    private initSTTAndComposerOptions() {
        const defaultLanguage = this.getSelectedLanguage();
        const languages = [defaultLanguage];
        // Always add English language if it's not the default
        if (defaultLanguage.id !== Language.ENGLISH.id) {
            languages.push(Language.ENGLISH);
        }

        const result = FormsComposerOptionsUtil.create({
            formId: this.formDetail.id,
            language: defaultLanguage,
            languages: languages,
            formType: this.formType,
            assmntDomain: this.formDetail.assmntDomain,
            allowAiSTTFormat: this.planDetail.formsAiEqnUserEnabled,
        });

        this.blockSTTOptions = result.blockSTTOptions;
        this.inlineSTTOptions = result.inlineSTTOptions;
        this.latexSTTOptions = result.latexSTTOptions;
        this.blockComposerOptions = result.blockComposerOptions;
        this.inlineComposerOptions = result.inlineComposerOptions;
    }

    get planDetail() {
        return this.parentStore.appStore.planDetail;
    }

    get stt(): STT {
        if (!this._stt) {
            throw new Error("STT is not initialized");
        }
        return this._stt;
    }

    set stt(stt: STT) {
        this._stt = stt;
    }

    get tts(): TTS | null {
        return this._tts;
    }

    set tts(tts: TTS | null) {
        if (tts) {
            if (this._tts) {
                this.removeTTSListeners();
            }
            this._tts = tts;
            this.setupTTSListeners();
        }
        else {
            this.removeTTSListeners();
            this._tts = null;
        }
    }

    private setupTTSListeners() {
        if (!this.tts) return;
        this.tts.onStart(this.boundHandleTTSStart);
        this.tts.onStop(this.boundHandleTTSEnd);
        this.ttsVoicesState = DataState.loading();
        this.tts.waitForVoices().then((data) => {
            this.ttsVoicesState = DataState.data(data);
        }).catch((error) => {
            this.ttsVoicesState = DataState.error(error);
        });
    }

    private removeTTSListeners() {
        if (!this.tts) return;
        this.tts.offStart(this.boundHandleTTSStart);
        this.tts.offStop(this.boundHandleTTSEnd);
        this.tts.stop();
    }


    handleTTSStart(tag: string) {
        runInAction(() => {
            this.currentTTSTag = tag;
        });
    }

    handleTTSEnd() {
        runInAction(() => {
            this.currentTTSTag = null;
        });
    }

    isSpeaking(question: QuestionVm): boolean {
        return this.currentTTSTag === this.speechTag(question);
    }

    speechTag(question: QuestionVm): string {
        return "question-" + question.base.id;
    }

    onClickSpeakQuestion(question: QuestionVm) {
        if (!this.isSpeaking(question)) {
            this.speakQuestion(question);
        }
        else {
            this.stopSpeaking();
        }
    }

    private getSelectedLanguage(): Language {
        return this.parentStore.selectedLanguage!;
    }


    private speakQuestion(question: QuestionVm) {
        if (!this.tts) return;
        const lang = this.getSelectedLanguage();
        const defaultVoice = this.tts.getDefaultVoiceForLanguage(lang.ttsCode);
        if (!defaultVoice) {
            showErrorToast({
                message: `Your browser does not support the speak option in ${lang.name}.`,
            });
            return;
        }
        const text = question.getSpeechText();
        const tag = this.speechTag(question);
        this.tts.speak({
            text: text,
            tag: tag,
            options: {
                voice: defaultVoice,
            }
        });
    }

    private stopSpeaking() {
        if (!this.tts) return;
        this.tts.stop();
    }



    get vm(): InteractionVm {
        return this.vmState.data!;
    }

    get formType(): FormType {
        return this.parentStore.formDetail.type;
    }

    get formDetail() {
        return this.parentStore.formDetail;
    }

    get questions() {
        return this.vm.questions;
    }

    get hasTimeLimit() {
        return this.formDetail.hasTimeLimit;
    }

    async loadQuestions() {
        runInAction(() => {
            this.vmState = DataState.loading();
        });
        try {
            const res = await this.parentStore.formService.getQuestions({
                formId: this.parentStore.formDetail.id,
                languageId: this.parentStore.selectedLanguage?.id,
            });
            if (res.isError) throw res.error;

            this.vmState?.data?.dispose();
            const interactionVm = new InteractionVm({
                questionRes: res.data,
                parentStore: this,
            });

            runInAction(() => {
                this.vmState = DataState.data(interactionVm);
            });

            this.startForm();
        } catch (error) {
            logger.error("Error loading questions", error);
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.vmState = DataState.error(appError);
            });
        }
    }

    private startForm() {
        this.startedOn = new Date();
        this.startTimerIfNeeded();
    }

    private startTimerIfNeeded() {
        this.stopTimer();
        if (!this.hasTimeLimit) return;
        runInAction(() => {
            this.remainingSeconds = this.formDetail.timeLimit!;
        });
        this.timer = setInterval(() => {
            runInAction(() => {
                this.remainingSeconds -= 1;
            });

            if (this.remainingSeconds <= 0) {
                this.stopTimer();
                this.onTimerCompleted();
            }
        }, 1000);
    }

    private stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    onTimerCompleted() {
        this.endTimer();
        this.dialogManager.closeAll();
        this.dialogManager.show({
            id: "times-up-dialog",
            component: TimesUpDialog,
            props: {
                store: this,
                onSubmit: async () => {
                    await this.onSubmitConfirmedByUser();
                },
                onQuit: () => {
                    this.onExitForm();
                },
            },
        });
    }

    get selectedLanguageId() {
        return this.parentStore.selectedLanguage?.id;
    }

    get selectedLanguage() {
        return this.parentStore.selectedLanguage!;
    }

    async onClickSubmitButton() {
        const hasErrors = await this.hasErrors();
        if (hasErrors) {
            showErrorToast({
                message: "Unable to submit the " + this.formDetail.type.name.toLocaleLowerCase(),
                description: "Please answer all questions marked with a star (*), and review the remaining questions to ensure there are no errors."
            });
            return;
        }

        const dialogEntry: DialogEntry<SubmitConfirmDialogProps> = {
            id: "submit-confirm-dialog",
            component: SubmitConfirmDialog,
            props: {
                store: this,
                onConfirm: async () => {
                    this.dialogManager.closeById("submit-confirm-dialog");
                    this.onSubmitConfirmedByUser();
                },
                onCancel: () => {
                    this.dialogManager.closeById("submit-confirm-dialog");
                },
            }
        }
        this.dialogManager.show(dialogEntry);
    }

    async hasErrors(): Promise<boolean> {
        let hasError = false;

        for (const question of this.questions) {
            if (question.base.type.isGroup) {
                const groupQuestion = question as GroupQuestionVm;
                for (const subQuestion of groupQuestion.subQuestions) {
                    if (subQuestion.validate()) {
                        hasError = true;
                    }
                }
            } else {
                if (question.validate()) {
                    hasError = true;
                }
            }
        }
        return hasError;
    }

    async endTimer() {
        this.endedOn = new Date();
        this.stopTimer();
    }

    async onSubmitConfirmedByUser() {
        await this.endTimer();
        await this.submitDataToServer();
    }


    async onClickRetrySubmitForm() {
        await this.submitDataToServer();
    }

    private async submitDataToServer() {
        try {
            if (this.submitState.isLoading) return false;
            showLoadingDialog({
                dialogId: "submit-form-overlay",
                dialogManager: this.dialogManager,
                message: "Submitting...",
            });
            runInAction(() => {
                this.submitState = DataState.loading();
            });
            const data = this.prepareDataToSubmit();
            const submitFormReq = new SubmitFormReq({
                formId: this.parentStore.formDetail.id,
                submittedLanguageId: this.selectedLanguageId!,
                startedOn: this.startedOn,
                endedOn: this.endedOn!,
                questions: data,
            });
            const res = (await this.parentStore.formService.submitForm(submitFormReq)).getOrError();
            runInAction(() => {
                this.submitState = DataState.data(res);
                this.parentStore.setCurrentFragmentPreview();
                this.parentStore.loadFormDetail();
            });
            this.dialogManager.closeById("times-up-dialog");
        }
        catch (error) {
            logger.error("Error submitting form", error);
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.submitState = DataState.error(appError);
            });
            showErrorDialog({
                dialogId: "submit-form-error",
                dialogManager: this.dialogManager,
                message: appError.message,
                description: appError.description,
                primaryButton: {
                    text: "Retry",
                    onClick: () => {
                        this.dialogManager.closeById("submit-form-error");
                        this.onClickRetrySubmitForm();
                    },
                },
                secondaryButton: {
                    text: "Quit",
                    onClick: () => {
                        this.dialogManager.closeById("submit-form-error");
                        this.onExitForm();
                    },
                }
            });
        }
        finally {
            this.dialogManager.closeById("submit-form-overlay");
        }
    }

    prepareDataToSubmit() {
        const submitQuestions: SubmitFormQuestion[] = [];
        for (const question of this.questions) {
            if (!question.base.type.isGroup) {
                // Non-group question: get answer directly
                const answer = question.getAnswer();
                if (answer) {
                    submitQuestions.push(new SubmitFormQuestion(question.base.id, answer));
                }
                continue;
            }

            const groupQuestion = question as GroupQuestionVm;
            const subQuestionAnswers: SubmitFormQuestion[] = [];
            for (const subQuestion of groupQuestion.subQuestions) {
                const answer = subQuestion.getAnswer?.();
                if (answer !== undefined) {
                    subQuestionAnswers.push(new SubmitFormQuestion(subQuestion.base.id, answer));
                }
            }
            if (subQuestionAnswers.length > 0) {
                submitQuestions.push(new SubmitFormQuestion(question.base.id, undefined, subQuestionAnswers));
            }
        }
        return submitQuestions;
    }

    onExitForm() {
        const dialogEntry: DialogEntry<QuitFormDialogProps> = {
            id: "quit-form-dialog",
            component: QuitFormDialog,
            props: {
                store: this,
                onConfirmQuit: () => {
                    this.dialogManager.closeById("quit-form-dialog");
                    this.doFinalQuit();
                },
                onCancel: () => {
                    this.dialogManager.closeById("quit-form-dialog");
                },
            }
        };
        this.dialogManager.show(dialogEntry);
    }

    private doFinalQuit() {
        this.dialogManager.closeById("times-up-dialog");
        this.parentStore.setCurrentFragmentPreview();
        this.parentStore.loadFormDetail();
    }

    dispose() {
        this.vmState.data?.dispose?.();
        this.stopTimer();
        this._stt?.dispose?.();
    }
}


