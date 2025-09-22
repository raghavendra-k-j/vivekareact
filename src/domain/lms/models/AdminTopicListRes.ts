import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminTopicItem } from "./AdminTopicItem";

export class AdminTopicListRes {
    pageInfo: PageInfo;
    items: AdminTopicItem[];

    constructor({ pageInfo, items }: { pageInfo: PageInfo; items: AdminTopicItem[] }) {
        this.pageInfo = pageInfo;
        this.items = items;
    }

    static fromJson(json: JsonObj): AdminTopicListRes {
        return new AdminTopicListRes({
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
            items: (json.items as JsonObj[]).map(itemJson => AdminTopicItem.fromJson(itemJson)),
        });
    }
}