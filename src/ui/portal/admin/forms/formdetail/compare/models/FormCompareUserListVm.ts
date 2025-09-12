import { NumChangeMetric } from "~/domain/common/models/NumChangeMetric";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { FormCompareUserItem } from "~/domain/forms/admin/models/compare/FormCompareUserItem";
import { FormCompareUserList } from "~/domain/forms/admin/models/compare/FormCompareUserList";

export class FormCompareUserItemVm {
    base: FormCompareUserItem;
    marksChange: NumChangeMetric;
    timeTakenChange: NumChangeMetric;

    constructor(item: FormCompareUserItem) {
        this.base = item;
        this.marksChange = NumChangeMetric.calculateChange(item.formA.marks, item.formB.marks);
        this.timeTakenChange = NumChangeMetric.calculateChange(item.formA.timeTaken, item.formB.timeTaken);
    }
}

export class FormCompareUserListVm {
    items: FormCompareUserItemVm[];
    pageInfo: PageInfo;

    constructor(data: FormCompareUserList) {
        this.items = data.items.map(item => new FormCompareUserItemVm(item));
        this.pageInfo = data.pageInfo;
    }
}