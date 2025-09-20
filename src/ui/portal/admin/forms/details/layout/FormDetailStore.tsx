import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { DataState } from "~/ui/utils/DataState";
import { AdminFormsLayoutStore } from "../../layout/FormsLayoutStore";
import { AdminFormDetailVm } from "../models/AdminFormDetailVm";

export interface AdminFormDetailStoreProps {
    permalink: string;
    layoutStore: AdminFormsLayoutStore;
}

export class AdminFormDetailStore {

    permalink: string;
    layoutStore: AdminFormsLayoutStore;
    vmState: DataState<AdminFormDetailVm> = DataState.init();

    constructor(props: AdminFormDetailStoreProps) {
        this.permalink = props.permalink;
        this.layoutStore = props.layoutStore;
        makeObservable(this, {
            vmState: observable.ref,
        });
    }

    get formDetailService() {
        return this.layoutStore.formsService;
    }

    get vm() {
        return this.vmState.data!;
    }


    loadFormDetails = async () => {
        try {
            runInAction(() => {
                this.vmState = DataState.loading();
            });
            const formDetail = (await this.formDetailService.getFormDetails({ permalink: this.permalink })).getOrError();
            const vm = AdminFormDetailVm.fromModel(formDetail);
            runInAction(() => {
                this.vmState = DataState.data(vm);
            });
        }
        catch (error) {
            console.error("Failed to load form details", error);
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.vmState = DataState.error(appError);
            });
        }
    }
}