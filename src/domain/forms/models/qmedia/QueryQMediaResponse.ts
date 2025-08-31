import { JsonObj } from "~/core/types/Json";
import { QMedia } from "./QMedia";
import { PageInfo } from "~/domain/common/models/PageInfo";

export type QueryQMediaResponseProps = {
    items: QMedia[];
    pageInfo: PageInfo;
}

export class QueryQMediaResponse {
    items: QMedia[];
    pageInfo: PageInfo;

    constructor(props: QueryQMediaResponseProps) {
        this.items = props.items;
        this.pageInfo = props.pageInfo;
    }

    static fromMap(map: JsonObj): QueryQMediaResponse {
        return new QueryQMediaResponse({
            items: map.items.map((item: JsonObj) => QMedia.fromJson(item)),
            pageInfo: PageInfo.fromJson(map.pageInfo)
        });
    }
}

export { PageInfo };

