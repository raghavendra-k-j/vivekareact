import { makeObservable, observable } from "mobx";
import { FormCompareDetail } from "~/domain/forms/admin/models/compare/FormCompareDetail";
import { FormCompareDetails } from "~/domain/forms/admin/models/compare/FormCompareDetails";

/* 
A ViewModel to hold the details and computed properties for comparing two forms.
*/
export class FormCompareDetailsVm {
    base: FormCompareDetails;
    formALabel: string;
    formBLabel: string;
    isSameTotalMarks : boolean;

    reverse(): FormCompareDetailsVm {
        return new FormCompareDetailsVm(this.base);
    }

    get formA(): FormCompareDetail {
        return this.base.formA;
    }

    get formB(): FormCompareDetail {
        return this.base.formB;
    }

    constructor(item: FormCompareDetails) {
        this.base = item;
        this.formALabel = this.base.formALabel;
        this.formBLabel = this.base.formBLabel;
        this.isSameTotalMarks = item.formA.totalMarks == item.formB.totalMarks;
        makeObservable(this, {
            formALabel: observable,
            formBLabel: observable,
        });
    }

}