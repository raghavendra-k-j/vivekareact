import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { FormCompareItem } from "./FormCompareItem";


type QueryFormsToCompareResProps = {
    items: FormCompareItem[];
    pageInfo: PageInfo;
}


class QueryFormsToCompareRes {
    items: FormCompareItem[];
    pageInfo: PageInfo;

    constructor(props: QueryFormsToCompareResProps) {
        this.items = props.items;
        this.pageInfo = props.pageInfo;
    }

    static fromJson(json: JsonObj): QueryFormsToCompareRes {
        const now = new Date();
        const items = json.items.map((item: JsonObj) => FormCompareItem.fromJson({ json: item, now: now }));
        return new QueryFormsToCompareRes({
            items: items,
            pageInfo: PageInfo.fromJson(json.pageInfo)
        });
    }
}



export { QueryFormsToCompareRes };