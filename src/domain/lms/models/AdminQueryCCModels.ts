import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { FormType } from "~/domain/forms/models/FormType";
import { AdminCCItem } from "./AdminCCItem";

export class AdminCCListReq {
    courseId: number;
    formType: FormType | null;
    formStatus: AdminFormStatus | null;
    page: number;
    pageSize: number;
    searchQuery: string | null;
    topicIds: number[] | null;

    constructor({
        courseId,
        formType,
        formStatus,
        page,
        pageSize,
        searchQuery,
        topicIds
    }: {
        courseId: number;
        formType: FormType | null;
        formStatus: AdminFormStatus | null;
        page: number;
        pageSize: number;
        searchQuery: string | null;
        topicIds: number[] | null;
    }) {
        this.courseId = courseId;
        this.formType = formType;
        this.formStatus = formStatus;
        this.page = page;
        this.pageSize = pageSize;
        this.searchQuery = searchQuery;
        this.topicIds = topicIds;
    }

    toJson(): JsonObj {
        return {
            courseId: this.courseId,
            formType: this.formType ? this.formType.type : null,
            formStatus: this.formStatus ? this.formStatus.status : null,
            page: this.page,
            pageSize: this.pageSize,
            searchQuery: this.searchQuery,
            topicIds: this.topicIds,
        };
    }
}

export class AdminCCListRes {
    pageInfo: PageInfo;
    items: AdminCCItem[];

    constructor({ pageInfo, items }: { pageInfo: PageInfo; items: AdminCCItem[] }) {
        this.pageInfo = pageInfo;
        this.items = items;
    }

    static fromJson(json: JsonObj, now: Date): AdminCCListRes {
        return new AdminCCListRes({
            pageInfo: PageInfo.fromJson(json.pageInfo),
            items: (json.items as JsonObj[]).map(itemJson => AdminCCItem.fromJson(itemJson, now)),
        });
    }
}
