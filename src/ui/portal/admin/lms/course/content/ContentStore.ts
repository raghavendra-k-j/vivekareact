import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminCCListReq } from "~/domain/lms/models/AdminQueryCCModels";
import { AdminCourseService } from "~/domain/lms/services/AdminCourseService";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { DataState } from "~/ui/utils/DataState";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";
import { AdminCCListVm } from "./models/AdminCCListVm";
import { FormType } from "~/domain/forms/models/FormType";
import { showLoadingDialog } from "~/ui/components/dialogs/showLoadingDialog";
import { CreateNewReq } from "~/domain/forms/admin/models/CreateNewReq";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";

export class ContentStore {
    layoutStore: CourseLayoutStore;

    searchQuery: string = "";
    queryState: DataState<AdminCCListVm> = DataState.init();
    pageSize: number = 50;
    currentPage: number = 1;

    constructor({ layoutStore }: { layoutStore: CourseLayoutStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            queryState: observable.ref,
            searchQuery: observable,
            currentPage: observable,
        });
    }

    get courserService(): AdminCourseService {
        return this.layoutStore.courseService;
    }

    get listVm(): AdminCCListVm {
        return this.queryState.data!;
    }

    get courseId(): number {
        return this.layoutStore.courseId;
    }

    async loadContents({ page = 1 }: { page?: number } = {}) {
        try {
            runInAction(() => {
                this.queryState = DataState.loading();
                this.currentPage = page;
            });

            const req = new AdminCCListReq({
                courseId: this.courseId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery || null,
                formType: null,
                formStatus: null,
                topicIds: null,
            });

            const res = (await withMinDelay(this.courserService.queryCourseContents(req), 300)).getOrError();
            const vm = AdminCCListVm.fromModel(res);

            runInAction(() => {
                this.queryState = DataState.data(vm);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.queryState = DataState.error(appError);
            });
        }
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
        this.loadContents({ page: 1 });
    }

    goToPage(page: number) {
        this.loadContents({ page });
    }

    async newForm({ type }: { type: FormType }) {
        const dialogId = "course-content-new-form-dialog";
        try {
            showLoadingDialog({
                dialogManager: this.layoutStore.dialogManager,
                dialogId: dialogId,
                message: "Preparing form...",
            });
            const req = new CreateNewReq({ type: type, languageId: null, spaceId: this.courseId });
            const res = (await this.layoutStore.formsService.createNewForm(req)).getOrError();
            showSuccessToast({
                message: "Form created successfully",
            });
            window.location.href = "https://latest.vivekaa.in/admin/forms/83c9ec24ccc148ebbba3cdea9e616b75";
        }
        catch (error) {
            const appError = AppError.fromAny(error);
            showErrorToast({
                message: appError.message,
                description: appError.description,
            });
        }
        finally {
            this.layoutStore.dialogManager.closeById(dialogId);
        }
    }


}