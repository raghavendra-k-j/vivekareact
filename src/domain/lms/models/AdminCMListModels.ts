import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { SpaceMemberRole } from "./SpaceMemberRole";
import { AdminCMItem } from "./AdminCMItem";

export class AdminCMListReq {
    courseId: number;
    page: number;
    pageSize: number;
    searchQuery: string | null;
    memberRole: SpaceMemberRole | null;

    constructor({
        courseId,
        page,
        pageSize,
        searchQuery,
        memberRole
    }: {
        courseId: number;
        page: number;
        pageSize: number;
        searchQuery: string | null;
        memberRole: SpaceMemberRole | null;
    }) {
        this.courseId = courseId;
        this.page = page;
        this.pageSize = pageSize;
        this.searchQuery = searchQuery;
        this.memberRole = memberRole;
    }

    toJson(): JsonObj {
        return {
            courseId: this.courseId,
            page: this.page,
            pageSize: this.pageSize,
            searchQuery: this.searchQuery,
            memberRole: this.memberRole ? this.memberRole.role : null,
        };
    }
}

export class AdminCMListRes {
    pageInfo: PageInfo;
    items: AdminCMItem[];

    constructor({ pageInfo, items }: { pageInfo: PageInfo; items: AdminCMItem[] }) {
        this.pageInfo = pageInfo;
        this.items = items;
    }

    static fromJson(json: JsonObj): AdminCMListRes {
        return new AdminCMListRes({
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
            items: (json.items as JsonObj[]).map(itemJson => AdminCMItem.fromJson(itemJson)),
        });
    }
}

