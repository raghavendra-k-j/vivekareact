import { LMSLayoutStore } from "../../layout/LMSLayoutStore";

export class AdminMyCoursesStore {

    lmsStore: LMSLayoutStore;

    constructor({ lmsStore }: { lmsStore: LMSLayoutStore }) {
        this.lmsStore = lmsStore;
    }

}