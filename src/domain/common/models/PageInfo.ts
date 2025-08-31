import { JsonObj } from "~/core/types/Json";

export type PageInfoProps = {
    pageSize: number;
    page: number;
    totalItems: number;
    totalPages: number;
}

export class PageInfo {

    pageSize: number;
    page: number;
    totalItems: number;
    totalPages: number;

    constructor(props: PageInfoProps) {
        this.pageSize = props.pageSize;
        this.page = props.page;
        this.totalItems = props.totalItems;
        this.totalPages = props.totalPages;
    }

    static fromJson(map: JsonObj): PageInfo {
        return new PageInfo({
            pageSize: map.pageSize,
            page: map.page,
            totalItems: map.totalItems,
            totalPages: map.totalPages
        });
    }
}