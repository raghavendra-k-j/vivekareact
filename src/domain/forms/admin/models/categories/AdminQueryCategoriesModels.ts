import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";

export class AdminQueryCategoriesReq {
    searchQuery: string | null;
    page: number;
    pageSize: number;

    constructor({
        searchQuery,
        page,
        pageSize
    }: {
        searchQuery: string | null;
        page: number;
        pageSize: number;
    }) {
        this.searchQuery = searchQuery;
        this.page = page;
        this.pageSize = pageSize;
    }

    toJson(): JsonObj {
        return {
            searchQuery: this.searchQuery,
            page: this.page,
            pageSize: this.pageSize,
        };
    }
}

export class AdminQueryCategoriesRes {
    pageInfo: PageInfo;
    items: AdminCategoryListTile[];

    constructor({ pageInfo, items }: { pageInfo: PageInfo; items: AdminCategoryListTile[] }) {
        this.pageInfo = pageInfo;
        this.items = items;
    }

    static fromJson(json: JsonObj): AdminQueryCategoriesRes {
        return new AdminQueryCategoriesRes({
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
            items: (json.items as JsonObj[]).map(itemJson => AdminCategoryListTile.fromJson(itemJson)),
        });
    }
}

export class AdminCategoryListTile {
    id: number;
    orgId: number;
    createdAt: Date;
    name: string;
    level: number;
    parentId: number | null;

    constructor({
        id,
        orgId,
        createdAt,
        name,
        level,
        parentId
    }: {
        id: number;
        orgId: number;
        createdAt: Date;
        name: string;
        level: number;
        parentId: number | null;
    }) {
        this.id = id;
        this.orgId = orgId;
        this.createdAt = createdAt;
        this.name = name;
        this.level = level;
        this.parentId = parentId;
    }

    static fromJson(json: JsonObj): AdminCategoryListTile {
        return new AdminCategoryListTile({
            id: Number(json.id),
            orgId: Number(json.orgId),
            createdAt: new Date(String(json.createdAt)),
            name: String(json.name),
            level: Number(json.level),
            parentId: json.parentId ? Number(json.parentId) : null,
        });
    }
}


