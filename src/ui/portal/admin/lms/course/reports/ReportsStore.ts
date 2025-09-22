import { computed, makeObservable } from "mobx";
import { CourseLayoutStore } from "../layout/CourseLayoutStore";

export class ReportsStore {
    layoutStore: CourseLayoutStore;

    constructor({ layoutStore }: { layoutStore: CourseLayoutStore }) {
        this.layoutStore = layoutStore;
        makeObservable(this, {
            totalAssessments: computed,
            totalSurveys: computed,
            totalAdmins: computed,
            totalUsers: computed,
        });
    }

    get totalAssessments(): number {
        return this.layoutStore.courseDetailState.isData ? this.layoutStore.course.totalAssessments : 0;
    }

    get totalSurveys(): number {
        return this.layoutStore.courseDetailState.isData ? this.layoutStore.course.totalSurveys : 0;
    }

    get totalAdmins(): number {
        return this.layoutStore.courseDetailState.isData ? this.layoutStore.course.totalAdmins : 0;
    }

    get totalUsers(): number {
        return this.layoutStore.courseDetailState.isData ? this.layoutStore.course.totalUsers : 0;
    }

    get isLoading(): boolean {
        return this.layoutStore.courseDetailState.isLoading;
    }

    get isError(): boolean {
        return this.layoutStore.courseDetailState.isError;
    }

    get error(): Error | null {
        return this.layoutStore.courseDetailState.error;
    }
}