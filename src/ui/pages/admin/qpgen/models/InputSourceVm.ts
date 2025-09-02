import { makeObservable, observable } from "mobx";
import { StrUtils } from "~/core/utils/StrUtils";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputSourceType } from "./InputSourceType";


export abstract class InputSourceVm {
    type: InputSourceType;

    abstract get content(): string | null;

    constructor({type}: {type: InputSourceType}) {
        this.type = type;
    }

    get isPaste(): boolean {
        return this.type === InputSourceType.Paste;
    }

    get isFileUpload(): boolean {
        return this.type === InputSourceType.FileUpload;
    }
}

export class PasteInputSourceVm extends InputSourceVm {
    contentField = new InputValue<string>("");
    constructor() {
        super({type: InputSourceType.Paste});
    }

    get content(): string | null {
        return StrUtils.trimToNull(this.contentField.value);
    }
}


export class FileInputSourceVm extends InputSourceVm {
    

    file: InputSourceFile | null = null;

    constructor() {
        super({type: InputSourceType.FileUpload});
        makeObservable(this, {
            file: observable.ref,
        });
    }

    get hasFile(): boolean {
        return this.file !== null;
    }

    get content(): string | null {
        return this.hasFile ? this.file!.fileContent : null;
    }

}

export class InputSourceFile {
    fileName: string;
    fileSize: number;
    fileContent: string;

    constructor({fileName, fileSize, fileContent}: {fileName: string; fileSize: number; fileContent: string}) {
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileContent = fileContent;
    }
}

