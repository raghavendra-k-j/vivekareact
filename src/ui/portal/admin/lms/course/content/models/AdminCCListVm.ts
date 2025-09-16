import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminCCListRes } from "~/domain/lms/models/AdminQueryCCModels";
import { AdminCCItem } from "~/domain/lms/models/AdminCCItem";

export class AdminCCListVm {
    pageInfo: PageInfo;
    items: AdminCCItem[];

    constructor(props: { pageInfo: PageInfo; items: AdminCCItem[] }) {
        this.pageInfo = props.pageInfo;
        this.items = props.items;
    }

    static fromModel(model: AdminCCListRes) {
        return new AdminCCListVm({
            pageInfo: model.pageInfo,
            items: model.items
        });
    }
}