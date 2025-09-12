export class InputSourceType {

    type: string;
    label: string;

    constructor({ type, label }: { type: string; label: string }) {
        this.type = type;
        this.label = label;
    }

    static Paste = new InputSourceType({
        type: "paste",
        label: "Paste Text"
    });

    static FileUpload = new InputSourceType({
        type: "file-upload",
        label: "Upload File"
    });

    static Url = new InputSourceType({
        type: "url",
        label: "From URL"
    });

}