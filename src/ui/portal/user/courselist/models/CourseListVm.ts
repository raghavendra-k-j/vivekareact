import { PageInfo } from "~/domain/common/models/PageInfo";
import { CourseListingRes, CourseItem } from "~/domain/userapp/models/CourseListingModels";

export class CourseItemVm {
    base: CourseItem;

    constructor({ base }: { base: CourseItem }) {
        this.base = base;
    }

    static fromModel(model: CourseItem): CourseItemVm {
        return new CourseItemVm({ base: model });
    }
}

export class CourseListVm {
    items: CourseItemVm[];
    pageInfo: PageInfo;

    constructor({
        items,
        pageInfo
    }: {
        items: CourseItemVm[];
        pageInfo: PageInfo;
    }) {
        this.items = items;
        this.pageInfo = pageInfo;
    }

    static fromModel(model: CourseListingRes): CourseListVm {
        return new CourseListVm({
            items: model.items.map(item => CourseItemVm.fromModel(item)),
            pageInfo: model.pageInfo,
        });
    }
}
