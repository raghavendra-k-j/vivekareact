import { makeObservable, observable } from "mobx";
import { FormCompareDetails } from "~/domain/forms/admin/models/compare/FormCompareDetails";
import { FormCompareItem } from "~/domain/forms/admin/models/compare/FormCompareItem";
import { DataState } from "~/ui/utils/DataState";


export type FormCompareItemVmProps = {
    item: FormCompareItem;
    detailState: DataState<FormCompareDetails>;
}

export class FormCompareItemVm {
    item: FormCompareItem;
    detailState: DataState<FormCompareDetails>;

    constructor(props: FormCompareItemVmProps) {
        this.item = props.item;
        this.detailState = props.detailState;
        makeObservable(this, {
            detailState: observable.ref,
        });
    }

    get isSelectBtnDisabled() {
        return this.item.adminFormStatus.isDraft || this.detailState.isLoading || this.item.totalResponses === 0;
    }

    get isEligibleForComparison() {
        return !this.item.adminFormStatus.isDraft && this.item.totalResponses > 0;
    }

}
