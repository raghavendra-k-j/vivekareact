import { makeObservable, observable, runInAction } from "mobx";
import { AppError } from "~/core/error/AppError";
import { TopicReportsReq } from "~/domain/lms/models/TopicsReportModels";
import { DataState } from "~/ui/utils/DataState";
import { TopicReportsVm } from "../shared/models/TopicReportsVm";
import { CourseDetailStore } from "./CourseDetailStore";

export class CourseReportsStore {
    parentStore: CourseDetailStore;
    topicReportsLoadState: DataState<TopicReportsVm> = DataState.init();

    constructor({ parentStore }: { parentStore: CourseDetailStore }) {
        this.parentStore = parentStore;
        makeObservable(this, {
            topicReportsLoadState: observable.ref,
        });
    }

    get topicReportsVm() {
        return this.topicReportsLoadState.data!;
    }

    get topicReports() {
        return this.topicReportsVm.items;
    }

    async loadTopicReports(req: TopicReportsReq) {
        try {
            runInAction(() => {
                this.topicReportsLoadState = DataState.loading();
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