import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { DataState } from "~/ui/utils/DataState";
import { AdminFormDetailVm } from "../models/AdminFormDetailVm";

export type AdminFormStoreType = {
    permalink: string;
}

export class AdminFormStore {

    permalink: string;
    fdState: DataState<AdminFormDetailVm> = DataState.init();
    adminFormService: AdminFormsService;

    constructor(props: AdminFormStoreType) {
        this.permalink = props.permalink;
        this.adminFormService = new AdminFormsService();
        makeObservable(this, {
            fdState: observable.ref,
        });
    }

    get fd() {
        return this.fdState.data!;
    }


    async loadFormDetails() {
        try {
            runInAction(() => {
                this.fdState = DataState.loading();
            });
            const response = (await this.adminFormService.getFormDetails({ permalink: this.permalink })).getOrError();            
            runInAction(() => {
                this.fdState = DataState.data(AdminFormDetailVm.fromModel(response));
            });
        }
        catch (e) {
            const apiError = AppError.fromAny(e);
            runInAction(() => {
                this.fdState = DataState.error(apiError);
            });
        }
    }


}