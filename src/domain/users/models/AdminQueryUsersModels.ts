import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminUserListItem } from "./AdminUserListItem";
import { JsonObj } from "~/core/types/Json";

export enum UserSortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum UserSortField {
    NAME = 'NAME',
    EMAIL = 'EMAIL',
    MOBILE = 'MOBILE',
    ROLE_NAME = 'ROLE_NAME',
    CREATED_AT = 'CREATED_AT',
}

export class AdminQueryUsersReq {
    pageSize: number;
    page: number;
    searchQuery?: string;
    sortOrder?: UserSortOrder;
    sortField?: UserSortField;

    constructor(params: { pageSize: number; page: number; searchQuery?: string; sortOrder?: UserSortOrder; sortField?: UserSortField }) {
        this.pageSize = params.pageSize;
        this.page = params.page;
        this.searchQuery = params.searchQuery;
        this.sortOrder = params.sortOrder;
        this.sortField = params.sortField;
    }

    toJson() {
        return {
            pageSize: this.pageSize,
            page: this.page,
            searchQuery: this.searchQuery,
            sortOrder: this.sortOrder,
            sortField: this.sortField,
        };
    }
}


export class AdminQueryUsersRes {
    items: AdminUserListItem[];
    pageInfo: PageInfo;

    constructor(params: { items: AdminUserListItem[]; pageInfo: PageInfo }) {
        this.items = params.items;
        this.pageInfo = params.pageInfo;
    }

    static fromJson(json: JsonObj): AdminQueryUsersRes {
        return new AdminQueryUsersRes({
            items: (json.items as JsonObj[]).map((item) => AdminUserListItem.fromJson(item)),
            pageInfo: PageInfo.fromJson(json.pageInfo),
        });
    }
}

