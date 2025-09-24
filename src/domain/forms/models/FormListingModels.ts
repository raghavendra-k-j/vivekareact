import { JsonObj } from "~/core/types/Json";
import { FormType } from "./FormType";
import { UserFormStatus } from "./UserFormStatus";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { TopicBase } from "~/domain/lms/models/TopicBase";

export class FormListingReq {
    searchQuery: string | null;
    status: UserFormStatus | null;
    page: number;
    pageSize: number;
    formType: FormType | null;
    spaceId: number | null;
    topicId: number | null;

    constructor({
        searchQuery,
        status,
        page,
        pageSize,
        formType,
        spaceId,
        topicId,
    }: {
        searchQuery: string | null;
        status: UserFormStatus | null;
        page: number;
        pageSize: number;
        formType: FormType | null;
        spaceId: number | null;
        topicId: number | null;
    }) {
        this.searchQuery = searchQuery;
        this.status = status;
        this.page = page;
        this.pageSize = pageSize;
        this.formType = formType;
        this.spaceId = spaceId;
        this.topicId = topicId;
    }

    toJson(): JsonObj {
        return {
            searchQuery: this.searchQuery,
            status: this.status ? this.status.status : null,
            page: this.page,
            pageSize: this.pageSize,
            formType: this.formType ? this.formType.type : null,
            spaceId: this.spaceId,
            topicId: this.topicId,
        };
    }
}

export class FormItem {
    id: number;
    type: FormType;
    status: UserFormStatus;
    createdAt: Date;
    updatedAt: Date;
    permalink: string;
    title: string;
    startDate: Date;
    endDate: Date;
    timeLimit: number | null;
    totalQuestions: number;
    totalMarks: number | null;
    responseId: number | null;
    passingMarks: number | null;
    gainedMarks: number | null;
    percentage: number | null;
    isEvaluated: boolean | null;
    topic: TopicBase | null;


    constructor({
        id,
        type,
        status,
        createdAt,
        updatedAt,
        permalink,
        title,
        startDate,
        endDate,
        timeLimit,
        totalQuestions,
        totalMarks,
        responseId,
        passingMarks,
        gainedMarks,
        percentage,
        isEvaluated,
        topic
    }: {
        id: number;
        type: FormType;
        status: UserFormStatus;
        createdAt: Date;
        updatedAt: Date;
        permalink: string;
        title: string;
        startDate: Date;
        endDate: Date;
        timeLimit: number | null;
        totalQuestions: number;
        totalMarks: number | null;
        responseId: number | null;
        passingMarks: number | null;
        gainedMarks: number | null;
        percentage: number | null;
        isEvaluated: boolean | null;
        topic: TopicBase | null;
    }) {
        this.id = id;
        this.type = type;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.permalink = permalink;
        this.title = title;
        this.startDate = startDate;
        this.endDate = endDate;
        this.timeLimit = timeLimit;
        this.totalQuestions = totalQuestions;
        this.totalMarks = totalMarks;
        this.responseId = responseId;
        this.passingMarks = passingMarks;
        this.gainedMarks = gainedMarks;
        this.percentage = percentage;
        this.isEvaluated = isEvaluated;
        this.topic = topic;
    }

    static fromJson(json: JsonObj): FormItem {
        const startDate = new Date(String(json.startDate));
        const endDate = new Date(String(json.endDate));
        const responseId = json.responseId ? Number(json.responseId) : null;
        const userFormStatus = UserFormStatus.fromDatesAndResponseId({
            startDate: startDate,
            endDate: endDate,
            responseId: responseId
        });
        return new FormItem({
            id: Number(json.id),
            type: FormType.fromType(String(json.type))!,
            status: userFormStatus,
            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt)),
            permalink: String(json.permalink),
            title: String(json.title),
            startDate: new Date(String(json.startDate)),
            endDate: new Date(String(json.endDate)),
            timeLimit: json.timeLimit ? Number(json.timeLimit) : null,
            totalQuestions: Number(json.totalQuestions),
            totalMarks: json.totalMarks ? Number(json.totalMarks) : null,
            responseId: json.responseId ? Number(json.responseId) : null,
            passingMarks: json.passingMarks ? Number(json.passingMarks) : null,
            gainedMarks: json.gainedMarks ? Number(json.gainedMarks) : null,
            percentage: json.percentage ? Number(json.percentage) : null,
            isEvaluated: json.isEvaluated ? Boolean(json.isEvaluated) : null,
            topic: json.topic ? TopicBase.fromJson(json.topic as JsonObj) : null,
        });
    }
}

export class FormListingRes {
    items: FormItem[];
    pageInfo: PageInfo;

    constructor({
        items,
        pageInfo
    }: {
        items: FormItem[];
        pageInfo: PageInfo;
    }) {
        this.items = items;
        this.pageInfo = pageInfo;
    }

    static fromJson(json: JsonObj): FormListingRes {
        return new FormListingRes({
            items: (json.items as JsonObj[]).map(item => FormItem.fromJson(item)),
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
        });
    }
}
