import { PageInfo } from "~/domain/common/models/PageInfo";
import { QueryAddMemberItem, QueryAddMembersRes } from "~/domain/lms/models/QueryAddMembersModels";

export class QueryMembersVm {
    pageInfo: PageInfo;
    members: QueryAddMemberItem[];

    constructor(pageInfo: PageInfo, members: QueryAddMemberItem[]) {
        this.pageInfo = pageInfo;
        this.members = members;
    }

    static fromModel(model: QueryAddMembersRes): QueryMembersVm {
        return new QueryMembersVm(model.pageInfo, model.items);
    }
}