import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminCMListRes } from "~/domain/lms/models/AdminCMListModels";
import { AdminCMItem } from "~/domain/lms/models/AdminCMItem";

export class AdminCMListVm {
    pageInfo: PageInfo;
    items: AdminCMItem[];

    constructor(props: { pageInfo: PageInfo; items: AdminCMItem[] }) {
        this.pageInfo = props.pageInfo;
        this.items = props.items;
    }

    static fromModel(model: AdminCMListRes) {
        return new AdminCMListVm({
            pageInfo: model.pageInfo,
            items: model.items
        });
    }
}