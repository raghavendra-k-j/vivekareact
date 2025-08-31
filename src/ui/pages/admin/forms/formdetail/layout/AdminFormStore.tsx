import { makeObservable, observable, runInAction } from "mobx";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { DataState } from "~/ui/utils/DataState";
import { AdminFormDetailVm } from "../common/models/AdminFormDetailVm";
import { AppError } from "~/core/error/AppError";

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
            const response = (await withMinDelay(
                this.adminFormService.getFormDetails({ permalink: this.permalink })
            )).getOrError();
            
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