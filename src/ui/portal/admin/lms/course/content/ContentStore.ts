import { action, makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { AdminCCListReq } from "~/domain/lms/models/AdminQueryCCModels";
import { AdminCCItem } from "~/domain/lms/models/AdminCCItem";
import { AdminCourseService } from "~/domain/lms/services/AdminCourseService";
import { withMinDelay } from "~/infra/utils/withMinDelay";
import { EasyTableData, EasyTableState } from "~/ui/components/easytable/types";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";
import { AdminCCListVm } from "./models/AdminCCListVm";
import { FormType } from "~/domain/forms/models/FormType";
import { showLoadingDialog } from "~/ui/components/dialogs/showLoadingDialog";
import { CreateNewReq } from "~/domain/forms/admin/models/CreateNewReq";
import { showErrorToast, showSuccessToast } from "~/ui/widgets/toast/toast";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";

export class ContentStore {
    layoutStore: CourseLayoutStore;

    searchQuery: string = "";
    selectedFormType: FormType | null = null;
    selectedAdminFormStatus: AdminFormStatus | null = null;
    queryState: EasyTableState<AdminCCItem> = EasyTableState.init<AdminCCItem>();
    dataVmOpt: AdminCCListVm | null = null;
    pageSize: number = 10;
    currentPage: number = 1;

    constructor({ layoutStore }: { layoutStore: CourseLayoutStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            queryState: observable.ref,
            dataVmOpt: observable.ref,
            searchQuery: observable,
            selectedFormType: observable,
            selectedAdminFormStatus: observable,
            currentPage: observable,
            pageSize: observable,
            updateSearchQuery: action,
            changePage: action,
            changePageSize: action,
        });
    }

    get courserService(): AdminCourseService {
        return this.layoutStore.courseService;
    }

    get listVm(): AdminCCListVm {
        return this.dataVmOpt!;
    }

    get courseId(): number {
        return this.layoutStore.course.id;
    }

    updateSearchQuery(query: string) {
        this.searchQuery = query;
    }

    changePage(page: number) {
        this.currentPage = page;
        this.loadContents({ page: page });
    }

    changePageSize(size: number) {
        this.pageSize = size;
        this.currentPage = 1;
        this.loadContents({ page: 1 });
    }

    async loadContents({ page = 1 }: { page?: number } = {}) {
        console.log("ContentStore: loadContents", { page });
        try {
            runInAction(() => {
                this.queryState = EasyTableState.loading();
                this.currentPage = page;
            });

            const req = new AdminCCListReq({
                courseId: this.courseId,
                page: page,
                pageSize: this.pageSize,
                searchQuery: this.searchQuery || null,
                formType: this.selectedFormType || null,
                formStatus: this.selectedAdminFormStatus || null,
                topicIds: null,
            });

            const res = (await withMinDelay(this.courserService.queryCourseContents(req), 300)).getOrError();
            const vm = AdminCCListVm.fromModel(res);
            runInAction(() => {
                this.dataVmOpt = vm;
                const tableData = new EasyTableData({
                    items: vm.items,
                    currentPage: vm.pageInfo.page,
                    pageSize: vm.pageInfo.pageSize,
                    totalItems: vm.pageInfo.totalItems,
                });
                this.queryState = EasyTableState.data(tableData);
            });
        } catch (error) {
            const appError = AppError.fromAny(error);
            runInAction(() => {
                this.queryState = EasyTableState.error(appError);
            });
        }
    }

    reloadCurrentState(): void {
        this.loadContents({ page: this.currentPage });
    }

    setSearchQuery(query: string) {
        this.searchQuery = query;
        this.loadContents({ page: 1 });
    }

    setSelectedFormType(type: FormType | null) {
        this.selectedFormType = type;
        this.loadContents({ page: 1 });
    }

    setSelectedAdminFormStatus(status: AdminFormStatus | null) {
        this.selectedAdminFormStatus = status;
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

            if(1 === 1) {
                window.location.href = 'http://test.rklocal.com:8080/admin/forms/87a0a7acecb5494796076835df974234';
                return;
            }

            const redirectUrl = `http://test.rklocal.com:8080/admin/forms/${res.permalink}`;
            window.location.href = redirectUrl;
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