import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminCourseService } from "~/domain/lms/services/AdminCourseService";
import { DataState } from "~/ui/utils/DataState";
import { LMSLayoutStore } from "../../layout/LMSLayoutStore";
import { CourseDetailVM } from "../models/CourseDetailVM";
import { copyToClipboard } from "~/core/utils/clipboard";
import { showSuccessToast } from "~/ui/widgets/toast/toast";
import { AdminRolesService } from "~/domain/users/services/AdminRolesService";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";

export class CourseLayoutStore {

    layoutStore: LMSLayoutStore;
    courseId: number;
    courseService: AdminCourseService;
    adminUserRolesService: AdminRolesService;
    dialogManager: DialogManagerStore;
    formsService: AdminFormsService;

    courseDetailState: DataState<CourseDetailVM> = DataState.init();

    constructor({
        layoutStore,
        courseId,
        dialogManager,
        formsService,
    }: {
        layoutStore: LMSLayoutStore;
        courseId: number;
        dialogManager: DialogManagerStore;
        formsService: AdminFormsService;
    }) {
        this.layoutStore = layoutStore;
        this.courseId = courseId;
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
        return this.layoutStore.entity(defId);
    }

    async loadCourseDetails() {
        try {
            runInAction(() => {
                this.courseDetailState = DataState.loading();
            });
            const result = (await this.courseService.getCourseDetails(this.courseId)).getOrError();
            const viewModel = CourseDetailVM.fromModel(result);
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

    copyCouseCode() {
        copyToClipboard({ text: this.course.id.toString() });
        showSuccessToast({
            message: "Course code copied to clipboard",
        });
    }

}