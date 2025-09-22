import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminQueryMyCoursesRes } from "~/domain/lms/models/AdminMyCoursesListingModels";
import { AdminMyCourseItem } from "~/domain/lms/models/AdminMyCourseItem";

export class AdminMyCoursesListVm {
    pageInfo: PageInfo;
    items: AdminMyCourseItem[];

    constructor(props: { pageInfo: PageInfo; items: AdminMyCourseItem[] }) {
        this.pageInfo = props.pageInfo;
        this.items = props.items;
    }

    static fromModel(model: AdminQueryMyCoursesRes) {
        return new AdminMyCoursesListVm({
            pageInfo: model.pageInfo,
            items: model.items
        });
    }
}