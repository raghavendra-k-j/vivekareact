import { DataState } from "~/ui/utils/DataState";
import { FormComparisonOverview } from "~/domain/forms/admin/models/compare/FormComparisonOverview";
import { FormCompareDetail } from "~/domain/forms/admin/models/compare/FormCompareDetail";
import { makeObservable, observable, reaction, runInAction } from "mobx";
import { AdminFormCompareStore } from "../ComparePageStore";
import { createSearchDebounce } from "~/core/utils/searchDebouce";
import { FormCompareUserListVm } from "./FormCompareUserListVm";
import { FormCompareDetailsVm } from "./FormCompareDetailsVm";

type CompareVmProps = {
    parentStore: AdminFormCompareStore;
    detailsVm: FormCompareDetailsVm;
}

export class CompareVm {
    parentStore: AdminFormCompareStore;
    detailsVm: FormCompareDetailsVm;
    overViewState = DataState.init<FormComparisonOverview>();
    usersState = DataState.init<FormCompareUserListVm>();
    searchQuery: string = "";

    constructor(props: CompareVmProps) {
        this.parentStore = props.parentStore;
        this.detailsVm = props.detailsVm;
        makeObservable(this, {
            overViewState: observable.ref,
            usersState: observable.ref,
            searchQuery: observable,
        });

        const debouncedUserFetch = createSearchDebounce(() => {
            this.parentStore.fetchComparisonUsers();
        });

        reaction(
            () => this.searchQuery,
            () => debouncedUserFetch.invoke()
        );
    }

    get formA(): FormCompareDetail {
        return this.detailsVm.base.formA;
    }

    get formB(): FormCompareDetail {
        return this.detailsVm.base.formB;
    }

    onSearchQueryChange(value: string): void {
        runInAction(() => this.searchQuery = value);
    }

}