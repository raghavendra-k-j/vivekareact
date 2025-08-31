import { JsonObj } from "~/core/types/Json";
import { FormCompareItem } from "./FormCompareItem";

export type FormCompareMetaDataProps = {
    recommendedForm: FormCompareItem | null;
}

export class FormCompareMetaData {
    recommendedForm: FormCompareItem | null;

    constructor(props: FormCompareMetaDataProps) {
        this.recommendedForm = props.recommendedForm;
    }

    static fromJson(json: JsonObj): FormCompareMetaData {
        const recommendedForm = json.recommendedForm ? FormCompareItem.fromJson({
            json: json.recommendedForm,
            now: new Date()
        }) : null;
        return new FormCompareMetaData({
            recommendedForm: recommendedForm
        });
    }
}
