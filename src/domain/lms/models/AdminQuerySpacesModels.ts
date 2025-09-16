import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminFolderInfo } from "./AdminFolderInfo";
import { AdminSpaceItem } from "./AdminSpaceItem";

export interface AdminSpaceListReqProps {
    parentId: number | null;
    page: number;
    pageSize: number;
    searchQuery: string | null;
}

export class AdminSpaceListReq {
    public parentId: number | null;
    public page: number;
    public pageSize: number;
    public searchQuery: string | null;

    constructor(props: AdminSpaceListReqProps) {
        this.parentId = props.parentId;
        this.page = props.page;
        this.pageSize = props.pageSize;
        this.searchQuery = props.searchQuery;
    }

    toJson(): JsonObj {
        return {
            parentId: this.parentId,
            page: this.page,
            pageSize: this.pageSize,
            searchQuery: this.searchQuery
        };
    }
}

export interface AdminSpaceListResProps {
    pageInfo: PageInfo;
    folder: AdminFolderInfo | null;
    items: AdminSpaceItem[];
}

export class AdminSpaceListRes {
    public pageInfo: PageInfo;
    public folder: AdminFolderInfo | null;
    public items: AdminSpaceItem[];

    constructor(props: AdminSpaceListResProps) {
        this.pageInfo = props.pageInfo;
        this.folder = props.folder;
        this.items = props.items;
    }

    static fromJson(json: JsonObj): AdminSpaceListRes {
        return new AdminSpaceListRes({
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
            folder: json.folder ? AdminFolderInfo.fromJson(json.folder as JsonObj) : null,
            items: (json.items as JsonObj[]).map(item => AdminSpaceItem.fromJson(item))
        });
    }
}


