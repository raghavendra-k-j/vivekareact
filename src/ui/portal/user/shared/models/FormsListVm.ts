import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { FormItem } from "~/domain/forms/models/FormListingModels";

export class ContentsListVm {
    pageInfo: PageInfo;
    items: FormItemVm[];

    constructor({
        pageInfo,
        items
    }: {
        pageInfo: PageInfo;
        items: FormItemVm[];
    }) {
        this.pageInfo = pageInfo;
        this.items = items;
    }


    static fromJson(json: JsonObj): ContentsListVm {
        const pageInfo = PageInfo.fromJson(json.pageInfo as JsonObj);
        const items = (json.items as JsonObj[]).map(itemJson => FormItemVm.fromJson(itemJson));
        return new ContentsListVm({ pageInfo, items });
    }
}

export class FormItemVm {
    base: FormItem;

    constructor({ base }: { base: FormItem }) {
        this.base = base;
    }

    static fromJson(json: JsonObj): FormItemVm {
        const base = FormItem.fromJson(json);
        return new FormItemVm({ base });
    }

}