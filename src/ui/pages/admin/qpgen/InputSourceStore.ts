import { action, makeObservable, observable, runInAction } from "mobx";
import { FValue } from "~/ui/widgets/form/FValue";
import { InputSourceType } from "./models/InputSourceType";
import { FileInputSourceVm, InputSourceFile, InputSourceVm, PasteInputSourceVm } from "./models/InputSourceVm";
import { QPGenPageStore } from "./QPGenPageStore";
import { FileProcessingPipeline } from "./models/UploadFileStep";
import { DataState } from "~/ui/utils/DataState";

export type InputSourceStoreProps = {
    storeRef: QPGenPageStore;
}


export class InputSourceStore {

    storeRef: QPGenPageStore;
    sourceType: InputSourceType = InputSourceType.FileUpload;
    pasteSource: PasteInputSourceVm = new PasteInputSourceVm();
    fileSource: FileInputSourceVm = new FileInputSourceVm();
    descriptionField = new FValue<string>("");
    filePipeline: FileProcessingPipeline | null = null;

    constructor({ storeRef }: InputSourceStoreProps) {
        this.storeRef = storeRef;
        makeObservable(this, {
            sourceType: observable,
            onInputSourceTypeChange: action,
            filePipeline: observable.ref
        });
    }

    get isPaste() {
        return this.sourceType === InputSourceType.Paste;
    }

    get isFileUpload() {
        return this.sourceType === InputSourceType.FileUpload;
    }


    get inputSourceVm(): InputSourceVm {
        if (this.sourceType === InputSourceType.Paste) {
            return this.pasteSource;
        }
        if (this.sourceType === InputSourceType.FileUpload) {
            return this.fileSource;
        }
        throw new Error("Unknown input source type: " + this.sourceType);
    }

    onInputSourceTypeChange(type: InputSourceType): void {
        this.sourceType = type;
    }

    onFileSelected(file: File): void {
        runInAction(() => {
            this.filePipeline = FileProcessingPipeline.createFromUpload({
                file: file,
                store: this.storeRef,
                onCompleted: (inputSourceFile: InputSourceFile) => {
                    runInAction(() => {
                        this.fileSource.file = inputSourceFile;
                    });
                }
            });
            this.filePipeline.startPipeline();
        });
    }

    clearFile(): void {
        runInAction(() => {
            this.fileSource.file = null;
            this.filePipeline = null;
            this.storeRef.qpGenState = DataState.init();
        });
    }

}