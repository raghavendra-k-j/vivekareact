import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { UserBase } from "~/domain/common/models/UserBase";
import { UserRoleType } from "~/domain/common/models/UserRoleType";
import { SpaceMemberRole } from "./SpaceMemberRole";


export class QueryAddMembersReq {

    courseId: number;
    page: number;
    pageSize: number;
    searchQuery?: string;
    roleType?: UserRoleType;
    excludeExisting?: boolean;

    constructor({
        courseId,
        page,
        pageSize,
        searchQuery,
        roleType,
        excludeExisting
    }: {
        courseId: number;
        page: number;
        pageSize: number;
        searchQuery?: string;
        roleType?: UserRoleType;
        excludeExisting?: boolean;
    }) {
        this.courseId = courseId;
        this.page = page;
        this.pageSize = pageSize;
        this.searchQuery = searchQuery;
        this.roleType = roleType;
        this.excludeExisting = excludeExisting;
    }

    static fromJson(json: JsonObj): QueryAddMembersReq {
        return new QueryAddMembersReq({
            courseId: Number(json["courseId"]),
            page: Number(json["page"]),
            pageSize: Number(json["pageSize"]),
            searchQuery: json["searchQuery"] ? String(json["searchQuery"]) : undefined,
            roleType: json["roleType"] ? UserRoleType.fromValueStr(String(json["roleType"])) : undefined,
            excludeExisting: json["excludeExisting"] ? Boolean(json["excludeExisting"]) : undefined,
        });
    }

    toJson(): JsonObj {
        return {
            courseId: this.courseId,
            page: this.page,
            pageSize: this.pageSize,
            searchQuery: this.searchQuery,
            roleType: this.roleType?.value,
            excludeExisting: this.excludeExisting,
        };
    }

}

export class QueryAddMembersRes {
    pageInfo: PageInfo;
    items: QueryAddMemberItem[];

    constructor({ pageInfo, items }: { pageInfo: PageInfo; items: QueryAddMemberItem[] }) {
        this.pageInfo = pageInfo;
        this.items = items;
    }

    static fromJson(json: JsonObj): QueryAddMembersRes {
        return new QueryAddMembersRes({
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
            items: (json.items as JsonObj[]).map(itemJson => QueryAddMemberItem.fromJson(itemJson)),
        });
    }
}

export class QueryAddMemberItem {
    userBase: UserBase;
    roleType: UserRoleType;
    joinedAt: Date | null;
    courseRole: SpaceMemberRole | null;

    constructor({
        userBase,
        roleType,
        joinedAt,
        courseRole
    }: {
        userBase: UserBase;
        roleType: UserRoleType;
        joinedAt: Date | null;
        courseRole: SpaceMemberRole | null;
    }) {
        this.userBase = userBase;
        this.roleType = roleType;
        this.joinedAt = joinedAt;
        this.courseRole = courseRole;
    }

    static fromJson(json: JsonObj): QueryAddMemberItem {
        return new QueryAddMemberItem({
            userBase: UserBase.fromJson(json as JsonObj),
            roleType: UserRoleType.fromValueStr(String(json.roleType)),
            joinedAt: json.joinedAt ? new Date(String(json.joinedAt)) : null,
            courseRole: json.courseRole ? SpaceMemberRole.fromValue(String(json.courseRole)) : null,
        });
    }
}