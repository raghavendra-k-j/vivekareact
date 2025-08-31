import { Loader2 } from "lucide-react";
import { makeObservable, observable, runInAction } from "mobx";
import { FaCheckCircle, FaCloudUploadAlt, FaExclamationCircle } from "react-icons/fa";
import { AppError } from "~/core/error/AppError";
import { UploadAiContextRes } from "~/domain/aicontext/models/UploadAiContextModels";
import { DataState } from "~/ui/utils/DataState";
import { QPGenPageStore } from "../QPGenPageStore";
import { InputSourceFile } from "./InputSourceVm";



export class StepUi {
    icon: React.ReactNode;
    label: string;
    description: string | null = null;

    constructor({ icon, label, description }: { icon: React.ReactNode, label: string, description: string | null, isLoading: boolean }) {
        this.icon = icon;
        this.label = label;
        this.description = description;
    }
}


export abstract class PipelineStep {
    abstract get ui(): StepUi;
    abstract start(): Promise<void>;
    abstract retry(): void;
    abstract isError(): boolean;
    abstract get isLoading(): boolean;
}

export class UploadContextFileStep extends PipelineStep {
    file: File;
    storeRef: QPGenPageStore;
    state: DataState<UploadAiContextRes> = DataState.init();

    constructor(file: File, storeRef: QPGenPageStore) {
        super();
        this.file = file;
        this.storeRef = storeRef;
        makeObservable(this, {
            state: observable.ref,
        });
    }

    get isLoading(): boolean {
        return this.state.isLoading;
    }

    get ui(): StepUi {
        let icon: React.ReactNode = <FaCloudUploadAlt className="text-gray-500" />;
        let label = "Initializing upload...";
        let description = null;
        let isLoading = this.state.isLoading;

        if (this.state.isLoading) {
            icon = <Loader2 className="animate-spin w-full h-full text-blue-500" />;
            label = "Uploading...";
        } else if (this.state.isData) {
            icon = <FaCheckCircle className="text-emerald-500 w-full h-full" />;
            label = "Uploaded";
        } else if (this.state.isError) {
            icon = <FaExclamationCircle className="text-red-500 w-full h-full" />;
            const error = this.state.error;
            label = error.message;
            description = error.description;
        }
        return new StepUi({ icon, label, description, isLoading });
    }

    async start() {
        try {
            runInAction(() => {
                this.state = DataState.loading();
            });
            const res = (await this.storeRef.aiContextService.uploadAIContext(this.file)).getOrError();
            runInAction(() => {
                this.state = DataState.data(res);
            });
        } catch (error) {
            runInAction(() => {
                this.state = DataState.error(AppError.fromAny(error));
            });
        }
    }

    retry() {
        void this.start();
    }

    isError(): boolean {
        return this.state.isError;
    }

    getResult(): UploadAiContextRes | null {
        return this.state.data;
    }
}

// -------------------
// Extract Step
// -------------------
export class ExtractContextFromFileStep extends PipelineStep {
    fileUrlProvider: () => string;
    storeRef: QPGenPageStore;
    state: DataState<string> = DataState.init();

    constructor({ fileUrlProvider, storeRef }: { fileUrlProvider: () => string; storeRef: QPGenPageStore }) {
        super();
        this.fileUrlProvider = fileUrlProvider;
        this.storeRef = storeRef;
        makeObservable(this, {
            state: observable.ref,
        });
    }

    get isLoading(): boolean {
        return this.state.isLoading;
    }

    get ui(): StepUi {
        let icon: React.ReactNode = <FaCloudUploadAlt className="text-gray-500" />;
        let label = "Waiting for upload...";
        let description = null;
        let isLoading = this.state.isLoading;

        if (this.state.isLoading) {
            icon = <Loader2 className="animate-spin w-full h-full text-blue-500" />;
            label = "Extracting...";
        } else if (this.state.isData) {
            icon = <FaCheckCircle className="text-emerald-500 w-full h-full" />;
            label = "Extracted";
        } else if (this.state.isError) {
            icon = <FaExclamationCircle className="text-red-500 w-full h-full" />;
            const error = this.state.error;
            label = error.message;
            description = error.description;
        }

        return new StepUi({ icon, label, description, isLoading });
    }
    async start() {
        const fileUrl = this.fileUrlProvider();
        try {
            runInAction(() => {
                this.state = DataState.loading();
            });
            const context = (await this.storeRef.aiContextService.extractAIContext(fileUrl)).getOrError();
            runInAction(() => {
                this.state = DataState.data(context);
            });
        } catch (error) {
            runInAction(() => {
                this.state = DataState.error(AppError.fromAny(error));
            });
        }
    }

    retry() {
        void this.start();
    }

    isError(): boolean {
        return this.state.isError;
    }

    getResult(): string | null {
        return this.state.data;
    }
}


export class FileProcessingPipeline {
    steps: PipelineStep[];
    onCompleted: (inputSource: InputSourceFile) => void;

    constructor({ steps, onCompleted }: { steps: PipelineStep[]; onCompleted: (inputSource: InputSourceFile) => void }) {
        this.steps = steps;
        this.onCompleted = onCompleted;
    }

    async startPipeline(): Promise<void> {
        for (let i = 0; i < this.steps.length; i++) {
            const step = this.steps[i];
            await step.start();
            if (step.isError()) {
                return;
            }
        }
        this.triggerOnCompletedIfReady();
    }

    async retryStep(index: number): Promise<void> {
        for (let i = index; i < this.steps.length; i++) {
            const step = this.steps[i];
            await step.start();
            if (step.isError()) {
                return;
            }
        }
        this.triggerOnCompletedIfReady();
    }

    private triggerOnCompletedIfReady() {
        const allSuccessful = this.steps.every((step) => !step.isError());
        if (allSuccessful) {
            const inputSource = this.buildInputSource();
            if (inputSource) {
                this.onCompleted(inputSource);
            }
        }
    }

    private buildInputSource(): InputSourceFile | null {
        const uploadStep = this.steps.find(step => step instanceof UploadContextFileStep) as UploadContextFileStep | undefined;
        const extractStep = this.steps.find(step => step instanceof ExtractContextFromFileStep) as ExtractContextFromFileStep | undefined;
        if (!uploadStep?.getResult() || !extractStep?.getResult()) return null;
        return new InputSourceFile({
            fileName: uploadStep.getResult()!.fileName,
            fileSize: uploadStep.getResult()!.fileSize,
            fileContent: extractStep.getResult()!,
        });
    }

    getStep(index: number): PipelineStep {
        return this.steps[index];
    }

    getAllSteps(): PipelineStep[] {
        return this.steps;
    }

    static createFromUpload({
        file,
        store,
        onCompleted,
    }: {
        file: File;
        store: QPGenPageStore;
        onCompleted: (inputSource: InputSourceFile) => void;
    }): FileProcessingPipeline {
        const uploadStep = new UploadContextFileStep(file, store);
        const extractStep = new ExtractContextFromFileStep({
            fileUrlProvider: () => uploadStep.getResult()!.fileUrl,
            storeRef: store,
        });
        return new FileProcessingPipeline({
            steps: [uploadStep, extractStep],
            onCompleted,
        });
    }
}