import { JsonObj } from "~/core/types/Json";

export type UploadAiContextModels = {
    fileName: string;
    fileSize: number;
    fileUrl: string;
}

export class UploadAiContextRes {
    fileName: string;
    fileSize: number;
    fileUrl: string;

    constructor({ fileName, fileSize, fileUrl }: UploadAiContextModels) {
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileUrl = fileUrl;
    }

    static fromJson(json: JsonObj): UploadAiContextRes {
        return new UploadAiContextRes({
            fileName: json.file_name,
            fileSize: json.file_size,
            fileUrl: json.file_url
        });
    }

}