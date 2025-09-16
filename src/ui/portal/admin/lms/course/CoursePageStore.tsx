import { LMSLayoutStore } from "../layout/LMSLayoutStore";

export class CoursePageStore {
    layoutStore: LMSLayoutStore;

    constructor({ layoutStore }: { layoutStore: LMSLayoutStore }) {
        this.layoutStore = layoutStore;
    }
}