import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminCourseService } from "~/domain/lms/services/AdminCourseService";
import { DataState } from "~/ui/utils/DataState";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { AdminRolesService } from "~/domain/users/services/AdminRolesService";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { AdminCourseDetailVm } from "../models/AdminCourseDetailVm";

export class CourseLayoutStore {

    layoutStore: LMSLayoutStore;
    permalink: string;
    courseService: AdminCourseService;
    adminUserRolesService: AdminRolesService;
    dialogManager: DialogManagerStore;
    formsService: AdminFormsService;

    courseDetailState: DataState<AdminCourseDetailVm> = DataState.init();

    constructor({
        layoutStore,
        permalink,
        dialogManager,
        formsService,
    }: {
        layoutStore: LMSLayoutStore;
        permalink: string;
        dialogManager: DialogManagerStore;
        formsService: AdminFormsService;
    }) {
        this.layoutStore = layoutStore;
        this.permalink = permalink;
        this.courseService = new AdminCourseService();
        this.adminUserRolesService = new AdminRolesService();
        this.dialogManager = dialogManager;
        this.formsService = formsService;
        makeObservable(this, {
            courseDetailState: observable.ref,
        });
    }

    get course() {
        return this.courseDetailState.data!;
    }

    entity(defId: string) {
        return this.layoutStore.ed(defId);
    }

    async loadCourseDetails() {
        try {
            runInAction(() => {
                this.courseDetailState = DataState.loading();
            });
            const result = (await this.courseService.getCourseDetailsByPermalink(this.permalink)).getOrError();
            const viewModel = AdminCourseDetailVm.fromModel(result);
            runInAction(() => {
                this.courseDetailState = DataState.data(viewModel);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.courseDetailState = DataState.error(appError);
            });
        }
    }

}