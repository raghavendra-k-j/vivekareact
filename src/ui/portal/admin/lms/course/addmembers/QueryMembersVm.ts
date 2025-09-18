import { PageInfo } from "~/domain/common/models/PageInfo";
import { QueryAddMemberItem, QueryAddMembersRes } from "~/domain/lms/models/QueryAddMembersModels";

export class QueryMembersVm {
    pageInfo: PageInfo;
    items: QueryAddMemberItem[];

    constructor(pageInfo: PageInfo, items: QueryAddMemberItem[]) {
        this.pageInfo = pageInfo;
        this.items = items;
    }

    static fromModel(model: QueryAddMembersRes): QueryMembersVm {
        return new QueryMembersVm(
            model.pageInfo,
            model.items
        );
    }
}