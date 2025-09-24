import { JsonObj } from "~/core/types/Json";
import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { PageInfo } from "~/domain/common/models/PageInfo";

export class TopicReportsReq {
    page: number;
    pageSize: number;
    courseId: number;
    excludeEmptyTopics: boolean;

    constructor({
        page,
        pageSize,
        courseId,
        excludeEmptyTopics,
    }: {
        page: number;
        pageSize: number;
        courseId: number;
        excludeEmptyTopics: boolean;
    }) {
        this.page = page;
        this.pageSize = pageSize;
        this.courseId = courseId;
        this.excludeEmptyTopics = excludeEmptyTopics;
    }

    toJson(): JsonObj {
        return {
            page: this.page,
            pageSize: this.pageSize,
            courseId: this.courseId,
            excludeEmptyTopics: this.excludeEmptyTopics,
        };
    }
}

export class TopicReportItem {
    id: number;
    name: string;
    avatarColor: AvatarColor;
    totalAssessments: number;
    totalSurveys: number;
    completedAssessments: number;
    completedSurveys: number;
    averagePercentage: number;

    constructor({
        id,
        name,
        avatarColor,
        totalAssessments,
        totalSurveys,
        completedAssessments,
        completedSurveys,
        averagePercentage,
    }: {
        id: number;
        name: string;
        avatarColor: AvatarColor;
        totalAssessments: number;
        totalSurveys: number;
        completedAssessments: number;
        completedSurveys: number;
        averagePercentage: number;
    }) {
        this.id = id;
        this.name = name;
        this.avatarColor = avatarColor;
        this.totalAssessments = totalAssessments;
        this.totalSurveys = totalSurveys;
        this.completedAssessments = completedAssessments;
        this.completedSurveys = completedSurveys;
        this.averagePercentage = averagePercentage;
    }

    get totalItems() {
        return this.totalAssessments + this.totalSurveys;
    }

    get completedCount() {
        return this.completedAssessments + this.completedSurveys;
    }

    get completionPercentage() {
        if (this.totalItems === 0) {
            return 0;
        }
        return (this.completedCount / this.totalItems) * 100;
    }

    static fromJson(json: JsonObj): TopicReportItem {
        return new TopicReportItem({
            id: Number(json.id),
            name: String(json.name),
            avatarColor: AvatarColor.fromJson(json.avatarColor),
            totalAssessments: Number(json.totalAssessments),
            totalSurveys: Number(json.totalSurveys),
            completedAssessments: Number(json.completedAssessments),
            completedSurveys: Number(json.completedSurveys),
            averagePercentage: Number(json.averagePercentage),
        });
    }
}

export class TopicReportsRes {
    items: TopicReportItem[];
    pageInfo: PageInfo;

    constructor({
        items,
        pageInfo,
    }: {
        items: TopicReportItem[];
        pageInfo: PageInfo;
    }) {
        this.items = items;
        this.pageInfo = pageInfo;
    }

    static fromJson(json: JsonObj): TopicReportsRes {
        return new TopicReportsRes({
            items: (json.items as JsonObj[]).map(item => TopicReportItem.fromJson(item)),
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
        });
    }
}

