import { FormType } from "../../models/FormType";

export class CreateNewReq {
    type: FormType;
    languageId: string | null;
    spaceId: number | null;

    constructor({ type, languageId, spaceId }: { type: FormType; languageId: string | null; spaceId: number | null }) {
        this.type = type;
        this.languageId = languageId;
        this.spaceId = spaceId;
    }

    toJson() {
        return {
            type: this.type.type,
            languageId: this.languageId,
            spaceId: this.spaceId,
        };
    }

}