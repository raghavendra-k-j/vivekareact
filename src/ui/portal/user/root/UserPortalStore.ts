import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { UserAppConfig } from "~/domain/common/models/UserAppConfig";
import { UserAppService } from "~/domain/common/services/UserAppService";
import { FormService } from "~/domain/forms/services/FormsService";
import { CourseService } from "~/domain/userapp/services/CourseService";
import { ApiClient } from "~/infra/datasources/ApiClient";
import { FormRepo } from "~/infra/repos/forms/FormRepo";
import { DataState } from "~/ui/utils/DataState";

export class UserPortalStore {
    coursesService: CourseService;
    formsService: FormService;
    userAppConfigState: DataState<UserAppConfig> = DataState.init();
    userAppService: UserAppService;

    constructor() {
        this.coursesService = new CourseService();
        const apiClient = ApiClient.findInstance();
        const formRepo = new FormRepo({ apiClient });
        this.formsService = new FormService({ formRepo });
        this.userAppService = new UserAppService();
        makeObservable(this, {
            userAppConfigState: observable.ref,
        });
    }

    get userAppConfig() {
        return this.userAppConfigState.data!;
    }

    get navigation() {
        return this.userAppConfig.navigation;
    }

    get defaultNavItem() {
        return this.navigation.getNavItem(this.navigation.defaultItemId)!;
    }

    async loadUserAppConfig() {
        try {
            runInAction(() => {
                this.userAppConfigState = DataState.loading();
            });
            const res = (await this.userAppService.getUserAppConfig()).getOrError();
            runInAction(() => {
                this.userAppConfigState = DataState.data(res);
            });
        }
        catch (err) {
            const appError = AppError.fromAny(err);
            runInAction(() => {
                this.userAppConfigState = DataState.error(appError);
            });
        }
    }


}