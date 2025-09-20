import { PageInfo } from "~/domain/common/models/PageInfo";
import { FormListingRes, FormItem } from "~/domain/forms/models/FormListingModels";

export class FormItemVm {
    base: FormItem;

    constructor({ base }: { base: FormItem }) {
        this.base = base;
    }

    static fromModel(model: FormItem): FormItemVm {
        return new FormItemVm({ base: model });
    }
}

export class FormsListVm {
    items: FormItemVm[];
    pageInfo: PageInfo;

    constructor({
        items,
        pageInfo
    }: {
        items: FormItemVm[];
        pageInfo: PageInfo;
    }) {
        this.items = items;
        this.pageInfo = pageInfo;
    }

    static fromModel(model: FormListingRes): FormsListVm {
        return new FormsListVm({
            items: model.items.map(item => FormItemVm.fromModel(item)),
            pageInfo: model.pageInfo,
        });
    }
}