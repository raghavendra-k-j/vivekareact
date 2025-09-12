import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { ResEither } from "~/core/utils/ResEither";
import { DataState } from "~/ui/utils/DataState";

import { FormCompareDetails } from "~/domain/forms/admin/models/compare/FormCompareDetails";
import { FormCompareItem } from "~/domain/forms/admin/models/compare/FormCompareItem";
import { FormCompareMetaData } from "~/domain/forms/admin/models/compare/FormCompareMetaData";
import { FormCompareUserListReq } from "~/domain/forms/admin/models/compare/FormCompareUserListReq";
import { FormComparisonOverviewReq } from "~/domain/forms/admin/models/compare/FormComparisonOverviewReq";
import { DialogEntry, DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { showErrorToast } from "~/ui/widgets/toast/toast";
import { AdminFormStore } from "../layout/AdminFormStore";
import { CompareVm } from "./models/CompareStore";
import { CompareCurrentPageState } from "./models/CompareTabFragment";
import { FormCompareDetailsVm } from "./models/FormCompareDetailsVm";
import { FormCompareUserListVm } from "./models/FormCompareUserListVm";
import { UsersTableOption } from "./models/UsersTableOption";
import SelectFormDialog, { SelectFormDialogProps } from "./SelectFormDialog/SelectFormDialog";


export type AdminFormCompareStoreProps = {
    parentStore: AdminFormStore;
    dialogManager: DialogManagerStore;
}

export class AdminFormCompareStore {
    parentStore: AdminFormStore;
    dialogManager: DialogManagerStore;

    metadataState = DataState.init<FormCompareMetaData>();
    currentPageState = CompareCurrentPageState.SELECT_FORM;
    userTableOptions = new UsersTableOption();
    _compareVm: CompareVm | null = null;

    constructor({ parentStore, dialogManager }: AdminFormCompareStoreProps) {
        this.parentStore = parentStore;
        this.dialogManager = dialogManager;
        makeObservable(this, {
            metadataState: observable.ref,
            currentPageState: observable,
            _compareVm: observable.ref,
        });
    }

    get compareVm() {
        return this._compareVm!;
    }

    get comparisionDetailsVm() {
        return this.compareVm.detailsVm;
    }

    get userList() {
        return this.compareVm.usersState.data!;
    }

    get userListState() {
        return this.compareVm.usersState;
    }

    get comparisonOverview() {
        return this.compareVm.overViewState.data!;
    }

    get comparisonOverviewState() {
        return this.compareVm.overViewState;
    }

    get formMetadata() {
        return this.metadataState.data!;
    }

    // When a form is selected for comparison
    onFormSelected(detailsVm: FormCompareDetailsVm) {
        this.dialogManager.closeById("select-form-dialog");
        runInAction(() => {
            this._compareVm = new CompareVm({
                detailsVm: detailsVm,
                parentStore: this,
            });
            this.updateTableOptions(detailsVm);
            this.currentPageState = CompareCurrentPageState.RESULT_PAGE;
        });
    }

    onFormSelectedFromDialog(detailsVm: FormCompareDetailsVm) {
        this.dialogManager.closeById("select-form-dialog");
        this.onFormSelected(detailsVm);
    }

    updateTableOptions(detailsVm: FormCompareDetailsVm) {
        const formA = detailsVm.formA;
        const formB = detailsVm.formB;
        const anyHasPassMarks = formA.hasPassingMarks || formB.hasPassingMarks;
        runInAction(() => {
            this.userTableOptions.setShowPassStatusColumn(anyHasPassMarks);
        });
    }

    // Clears the current comparison state
    // So that the user can select a new form to compare
    resetComparison() {
        runInAction(() => {
            this.currentPageState = CompareCurrentPageState.SELECT_FORM;
            this._compareVm = null;
        });
    }

    // Fetches the details of the form to be compared
    // If the comparison can not be established, it returns an error
    async fetchFormCompareDetails({ formAId, formBId, restrictAutoOrganize }: { formAId: number, formBId: number, restrictAutoOrganize: boolean }): Promise<ResEither<AppError, FormCompareDetails>> {
        try {
            const res = await this.parentStore.adminFormService.getFormCompareDetails(formAId, formBId, restrictAutoOrganize);
            return ResEither.data(res.getOrError());
        }
        catch (error) {
            return ResEither.error(AppError.fromAny(error));
        }
    }

    // Fetches the inital metadata required to show in comparision page
    // This includes the recommended form to compare with
    async fetchMetadata() {
        try {
            runInAction(() => this.metadataState = DataState.loading());
            const response = await this.parentStore.adminFormService.queryComparisionMetaData(this.parentStore.fd.id);
            const data = response.getOrError();
            runInAction(() => this.metadataState = DataState.data(data));
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => this.metadataState = DataState.error(appError));
        }
    }

    // Retrives the comparison overview for the selected form
    async fetchComparisonOverview() {
        if (!this._compareVm) return;
        try {
            runInAction(() => this.compareVm.overViewState = DataState.loading());
            const formCompareDetails = this.comparisionDetailsVm;
            const request = new FormComparisonOverviewReq({
                formAId: formCompareDetails.formA.id,
                formBId: formCompareDetails.formB.id,
                formALabel: formCompareDetails.formALabel,
                formBLabel: formCompareDetails.formBLabel,
            });
            const response = await this.parentStore.adminFormService.getComparisonOverview(request);
            runInAction(() => this.compareVm.overViewState = DataState.data(response.getOrError()));
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => this.compareVm.overViewState = DataState.error(appError));
        }
    }

    // Fetches the list of users who have attempted both forms
    async fetchComparisonUsers({ page = 1 }: { page?: number } = {}) {
        if (!this._compareVm) return;
        try {
            runInAction(() => this.compareVm.usersState = DataState.loading());
            const request = new FormCompareUserListReq({
                formAId: this.comparisionDetailsVm.formA.id,
                formBId: this.comparisionDetailsVm.formB.id,
                formALabel: this.comparisionDetailsVm.formALabel,
                formBLabel: this.comparisionDetailsVm.formBLabel,
                page: page,
                pageSize: 10,
                searchQuery: this.compareVm.searchQuery,
            });
            const response = await this.parentStore.adminFormService.getComparisonUserList(request);
            runInAction(() => {
                const data = new FormCompareUserListVm(response.getOrError());
                this.compareVm.usersState = DataState.data(data);
            });
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => this.compareVm!.usersState = DataState.error(appError));
        }
    }

    // Updates the label for either form A or form B
    updateFormLabel({ label, isFormA }: { label: string, isFormA: boolean }) {
        if (!this._compareVm) return;
        runInAction(() => {
            if (isFormA) {
                this.comparisionDetailsVm.formALabel = label;
                this.comparisionDetailsVm.base.formALabel = label;
            }
            else {
                this.comparisionDetailsVm.formBLabel = label;
                this.comparisionDetailsVm.base.formALabel = label;
            }
        });
        this.fetchComparisonOverview();
    }

    showSelectFormDialog(): void {
        const entry: DialogEntry<SelectFormDialogProps> = {
            id: "select-form-dialog",
            component: SelectFormDialog,
            props: {
                parentStore: this,
                onClose: () => this.dialogManager.closeById("select-form-dialog"),
            }
        };
        this.dialogManager.show(entry);
    }

    async onRecommendedFormSelected(recommendedForm: FormCompareItem) {
        try {
            const response = (await this.fetchFormCompareDetails({ formAId: this.parentStore.fd.id, formBId: recommendedForm.id, restrictAutoOrganize: false })).getOrError();
            const vm = new FormCompareDetailsVm(response);
            this.onFormSelected(vm);
        }
        catch (e) {
            const appError = AppError.fromAny(e);
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }


    async reverseComparision() {
        if (!this._compareVm) return;
        try {
            let currentFormA = this.comparisionDetailsVm.formA;
            let currentFormB = this.comparisionDetailsVm.formB;
            [currentFormA, currentFormB] = [currentFormB, currentFormA];
            const res = await this.fetchFormCompareDetails({
                formAId: currentFormA.id,
                formBId: currentFormB.id,
                restrictAutoOrganize: true,
            });
            const data = res.getOrError();
            const vm = new FormCompareDetailsVm(data);
            this.onFormSelected(vm);
            this.fetchComparisonOverview();
            this.fetchComparisonUsers();
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
    }

    dispose() {
        // Add cleanup logic here if necessary in the future
    }
}
