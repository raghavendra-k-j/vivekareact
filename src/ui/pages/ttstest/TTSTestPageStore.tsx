import { action, makeObservable, observable } from "mobx";
import { FormType } from "~/domain/forms/models/FormType";
import { Language } from "~/domain/forms/models/Language";
import { SpeechVoice, TTS } from "~/infra/utils/tts/TTS";
import { FormsSTTDialog, FormsSTTDialogProps } from "~/ui/components/formssttdialog/FormsSTTDialog";
import { FormsSTTDocOptions } from "~/ui/components/formssttdialog/models/FormatSTTOptions";
import { DataState } from "~/ui/utils/DataState";
import { DialogEntry, DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { TestQuestion } from "./models/TestQuestion";

export class TTSTestPageStore {
    questions: TestQuestion[] = [];
    currentTTSTag: string | null = null;

    private _tts: TTS | null = null;
    private boundHandleTTSStart: (tag: string) => void;
    private boundHandleTTSEnd: (tag: string) => void;
    private ttsInitState: DataState<SpeechVoice[]> = DataState.init();

    constructor() {
        makeObservable(this, {
            currentTTSTag: observable,
            setCurrentTTSTag: action,
            clearCurrentTTSTag: action,
        });

        this.questions = TestQuestion.createTestQuestions();

        // Pre-bind handlers
        this.boundHandleTTSStart = this.handleTTSStart.bind(this);
        this.boundHandleTTSEnd = this.handleTTSEnd.bind(this);
    }

    get tts(): TTS | null {
        return this._tts;
    }

    onMount({ tts }: { tts: TTS }) {
        console.log("TTSTestPageStore mounted with TTS:", tts);
        this._tts = tts;
        this.setupTTSListeners();
    }

    onUnmount() {
        console.log("TTSTestPageStore unmounted");
        this.removeTTSListeners();
    }

    private setupTTSListeners() {
        if (!this.tts) return;
        console.log("Setting up TTS listeners");
        this.tts.onStart(this.boundHandleTTSStart);
        this.tts.onStop(this.boundHandleTTSEnd);
        this.ttsInitState = DataState.loading();
        this.tts.waitForVoices().then((data) => {
            this.ttsInitState = DataState.data(data);
            console.log("TTS voices initialized:", data);
        }).catch((error) => {
            console.error("Error initializing TTS voices:", error);
            this.ttsInitState = DataState.error(error);
        });
    }

    private removeTTSListeners() {
        if (!this.tts) return;
        console.log("Removing TTS listeners");
        this.tts.offStart(this.boundHandleTTSStart);
        this.tts.offStop(this.boundHandleTTSEnd);
        this.tts.stop();
    }

    onClickSpeakButton(question: TestQuestion): void {
        if (this.isSpeaking(question)) {
            this.stopSpeaking();
        } else {
            this.startSpeaking(question);
        }
    }

    isSpeaking(question: TestQuestion): boolean {
        return this.currentTTSTag === question.id;
    }

    get hasVoices(): boolean {
        return this.ttsInitState.isData && this.ttsInitState.data!.length > 0;
    }



    private startSpeaking(question: TestQuestion): void {
        if (!this.tts) return;
        if (!this.hasVoices) {
            console.warn("TTS voices are not loaded yet. Please wait.");
            return;
        }

        console.log("Starting to speak:", question.question);
        this.tts.speak({
            text: question.question,
            tag: question.id,
            options: {

            }
        });
    }

    private stopSpeaking(): void {
        if (!this.tts) return;
        console.log("Stopping current speech");
        this.tts.stop();
    }

    public setCurrentTTSTag(tag: string) {
        this.currentTTSTag = tag;
    }

    public clearCurrentTTSTag() {
        this.currentTTSTag = null;
    }

    private handleTTSStart(tag: string) {
        console.log("TTS started with tag:", tag);
        this.setCurrentTTSTag(tag);
    }

    private handleTTSEnd(tag: string) {
        console.log("TTS ended with tag:", tag);
        this.clearCurrentTTSTag();
    }



    /* 
     this.isRespondent = params.isRespondent;
            this.formId = params.formId;
            this.language = params.language;
            this.languageField = new FValue<string>(params.language.id);
            this.languages = params.languages;
            this.type = params.type;
    */

    openSTTDialog(dialogManager: DialogManagerStore) {
        const options: FormsSTTDocOptions = new FormsSTTDocOptions({
            formId: 1,
            isRespondent: true,
            language: Language.ENGLISH,
            languages: [Language.ENGLISH],
            isMultiline: true,
            aiAllowed: true,
            aiEnabled: true,
            formType: FormType.Assessment,
            assmntDomain: null,
        });
        const entry: DialogEntry<FormsSTTDialogProps> = {
            id: "stt-dialog",
            component: FormsSTTDialog,
            props: {
                onClose: () => {
                    dialogManager.closeById(entry.id);
                },
                onDone: () => {
                    dialogManager.closeById(entry.id);
                },
                options: options,
            }
        }
        dialogManager.show(entry);
    }



}
