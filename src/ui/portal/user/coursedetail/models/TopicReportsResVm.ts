import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { TopicReportItem, TopicReportsRes } from "~/domain/lms/models/TopicsReportModels";

export class TopicReportsVm {
    pageInfo: PageInfo;
    items: TopicReportItemVm[];

    constructor({
        pageInfo,
        items
    }: {
        pageInfo: PageInfo;
        items: TopicReportItemVm[];
    }) {
        this.pageInfo = pageInfo;
        this.items = items;
    }

    static fromDomain(domain: TopicReportsRes): TopicReportsVm {
        const pageInfo = domain.pageInfo;
        const items = domain.items.map(item => TopicReportItemVm.fromDomain(item));
        return new TopicReportsVm({ pageInfo, items });
    }
}

export class TopicReportItemVm {
    base: TopicReportItem;

    constructor({ base }: { base: TopicReportItem }) {
        this.base = base;
    }

    static fromDomain(domain: TopicReportItem): TopicReportItemVm {
        return new TopicReportItemVm({ base: domain });
    }
}