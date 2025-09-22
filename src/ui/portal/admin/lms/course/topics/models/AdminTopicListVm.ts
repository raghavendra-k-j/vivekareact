import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminTopicListRes } from "~/domain/lms/models/AdminTopicListRes";
import { AdminTopicItem } from "~/domain/lms/models/AdminTopicItem";

export class AdminTopicListVm {
    pageInfo: PageInfo;
    items: AdminTopicItem[];

    constructor(props: { pageInfo: PageInfo; items: AdminTopicItem[] }) {
        this.pageInfo = props.pageInfo;
        this.items = props.items;
    }

    static fromModel(model: AdminTopicListRes) {
        return new AdminTopicListVm({
            pageInfo: model.pageInfo,
            items: model.items
        });
    }
}