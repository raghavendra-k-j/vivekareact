import { JsonObj } from "~/core/types/Json";

export class AdminTopicListReq {
    page: number;
    pageSize: number;
    searchQuery: string | null;
    spaceId: number;

    constructor({
        page,
        pageSize,
        searchQuery,
        spaceId
    }: {
        page: number;
        pageSize: number;
        searchQuery: string | null;
        spaceId: number;
    }) {
        this.page = page;
        this.pageSize = pageSize;
        this.searchQuery = searchQuery;
        this.spaceId = spaceId;
    }

    toJson(): JsonObj {
        return {
            page: this.page,
            pageSize: this.pageSize,
            searchQuery: this.searchQuery,
            spaceId: this.spaceId,
        };
    }
}