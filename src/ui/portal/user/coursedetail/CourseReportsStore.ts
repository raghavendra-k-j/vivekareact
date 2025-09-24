import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { TopicReportsReq } from "~/domain/lms/models/TopicsReportModels";
import { DataState } from "~/ui/utils/DataState";
import { TopicReportsVm } from "../shared/models/TopicReportsVm";
import { CourseDetailStore } from "./CourseDetailStore";

export class CourseReportsStore {
    parentStore: CourseDetailStore;
    topicReportsLoadState: DataState<TopicReportsVm> = DataState.init();
    // TODO: Replace with topic reports pagination
    pageSize: number = 100;
    page: number = 1;

    constructor({ parentStore }: { parentStore: CourseDetailStore }) {
        this.parentStore = parentStore;
        makeObservable(this, {
            topicReportsLoadState: observable.ref,
        });
    }

    get topicReportsVm() {
        return this.topicReportsLoadState.data!;
    }

    get items() {
        return this.topicReportsVm.items;
    }


    async loadTopicReports({ page = 1 }: { page?: number } = {}) {
        try {
            runInAction(() => {
                this.topicReportsLoadState = DataState.loading();
            });
            const req = new TopicReportsReq({
                page: page,
                pageSize: this.pageSize,
                courseId: this.parentStore.courseVm.id,
                excludeEmptyTopics: false,
            });
            const res = (await this.parentStore.coursesService.queryTopicReports(req)).getOrError();
            const vm = TopicReportsVm.fromDomain(res);
            runInAction(() => {
                this.topicReportsLoadState = DataState.data(vm);
            });
        }
        catch (err) {
            const appError = AppError.fromAny(err);
            runInAction(() => {
                this.topicReportsLoadState = DataState.error(appError);
            });
        }
    }
}