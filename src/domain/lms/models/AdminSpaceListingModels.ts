import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { LMSFolderInfo } from "./LMSFolderInfo";
import { AdminSpaceItem } from "./AdminSpaceItem";

export interface AdminSpaceListReqProps {
    parentPermalink: string | null;
    page: number;
    pageSize: number;
    searchQuery: string | null;
}

export class AdminSpaceListReq {
    public parentPermalink: string | null;
    public page: number;
    public pageSize: number;
    public searchQuery: string | null;

    constructor(props: AdminSpaceListReqProps) {
        this.parentPermalink = props.parentPermalink;
        this.page = props.page;
        this.pageSize = props.pageSize;
        this.searchQuery = props.searchQuery;
    }

    toJson(): JsonObj {
        return {
            parentPermalink: this.parentPermalink,
            page: this.page,
            pageSize: this.pageSize,
            searchQuery: this.searchQuery
        };
    }
}

export interface AdminSpaceListResProps {
    pageInfo: PageInfo;
    folder: LMSFolderInfo | null;
    items: AdminSpaceItem[];
}

export class AdminSpaceListRes {
    public pageInfo: PageInfo;
    public folder: LMSFolderInfo | null;
    public items: AdminSpaceItem[];

    constructor(props: AdminSpaceListResProps) {
        this.pageInfo = props.pageInfo;
        this.folder = props.folder;
        this.items = props.items;
    }

    static fromJson(json: JsonObj): AdminSpaceListRes {
        return new AdminSpaceListRes({
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
            folder: json.folder ? LMSFolderInfo.fromJson(json.folder as JsonObj) : null,
            items: (json.items as JsonObj[]).map(item => AdminSpaceItem.fromJson(item))
        });
    }
}


