import { PageInfo } from "~/domain/forms/models/qmedia/QueryQMediaResponse";
import { FormCompareItemVm } from "./FormCompareItemVm";
import { QueryFormsToCompareRes } from "~/domain/forms/admin/models/compare/QueryFormsToCompareRes";
import { DataState } from "~/ui/utils/DataState";

export type QueryFormsToCompareResVmProps = {
    pageInfo: PageInfo;
    items: FormCompareItemVm[];
}

export class QueryFormsToCompareResVm {
    pageInfo: PageInfo;
    items: FormCompareItemVm[];

    constructor(props: QueryFormsToCompareResVmProps) {
        this.pageInfo = props.pageInfo;
        this.items = props.items;
    }

    static fromModel(model: QueryFormsToCompareRes) {
        const items = model.items.map(item => new FormCompareItemVm({
            item: item,
            detailState: DataState.init(),
        }));
        return new QueryFormsToCompareResVm({
            pageInfo: model.pageInfo,
            items: items,
        });
    }
}