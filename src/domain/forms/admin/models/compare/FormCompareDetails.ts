import { JsonObj } from "~/core/types/Json";
import { FormCompareDetail } from "./FormCompareDetail";

export type FormCompareDetailsProps = {
    formA: FormCompareDetail;
    formB: FormCompareDetail;
    formALabel: string;
    formBLabel: string;
    commonResponsesCount: number;
}

export class FormCompareDetails {

    formA: FormCompareDetail;
    formB: FormCompareDetail;
    formALabel: string;
    formBLabel: string;
    commonResponsesCount: number;

    constructor(params: FormCompareDetailsProps) {
        this.formA = params.formA;
        this.formB = params.formB;
        this.formALabel = params.formALabel;
        this.formBLabel = params.formBLabel;
        this.commonResponsesCount = params.commonResponsesCount;
    }

    static fromJson(json: JsonObj): FormCompareDetails {
        const now = new Date();
        return new FormCompareDetails({
            formA: FormCompareDetail.fromJson({json: json.formA, now: now}),
            formB: FormCompareDetail.fromJson({json: json.formB, now: now}),
            formALabel: json.formALabel,
            formBLabel: json.formBLabel,
            commonResponsesCount: json.commonResponsesCount,
        });
    }
}
