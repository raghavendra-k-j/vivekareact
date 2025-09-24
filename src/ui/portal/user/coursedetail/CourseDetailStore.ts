import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { DataState } from "~/ui/utils/DataState";
import { UserPortalStore } from "../root/UserPortalStore";
import { CourseContentsStore } from "./CourseContentsStore";
import { CourseReportsStore } from "./CourseReportsStore";
import { CourseDetailVm } from "./models/CourseDetailVm";

export interface CourseDetailStoreProps {
    userPortalStore: UserPortalStore;
    permalink: string;
}

export class CourseDetailStore {
    userPortalStore: UserPortalStore;
    permalink: string;

    loadState: DataState<CourseDetailVm> = DataState.init();
    contentsStore: CourseContentsStore;
    reportsStore: CourseReportsStore;

    constructor(props: CourseDetailStoreProps) {
        this.userPortalStore = props.userPortalStore;
        this.permalink = props.permalink;

        this.contentsStore = new CourseContentsStore({ parentStore: this });
        this.reportsStore = new CourseReportsStore({ parentStore: this });
        makeObservable(this, {
            loadState: observable.ref,
        });
    }

    get courseVm() {
        return this.loadState.data!;
    }

    get coursesService() {
        return this.userPortalStore.coursesService;
    }

    get formsService() {
        return this.userPortalStore.formsService;
    }

    async loadCourseDetail() {
        try {
            runInAction(() => {
                this.loadState = DataState.loading();
            });
            const res = (await this.coursesService.getCourseDetails(this.permalink)).getOrError();
            const vm = CourseDetailVm.fromModel(res);
            runInAction(() => {
                this.loadState = DataState.data(vm);
            });
            this.contentsStore.loadContents({ page: 1 });
            this.reportsStore.loadTopicReports({ page: 1 });
        }
        catch (err) {
            const appError = AppError.fromAny(err);
            runInAction(() => {
                this.loadState = DataState.error(appError);
            });
        }
    }
}