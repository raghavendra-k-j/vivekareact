import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { AvatarColor } from "~/domain/common/models/AvatarColor";

export class CourseListingReq {
    status: CourseStatus | null;
    page: number;
    pageSize: number;
    searchQuery: string | null;

    constructor({
        status,
        page,
        pageSize,
        searchQuery
    }: {
        status: CourseStatus | null;
        page: number;
        pageSize: number;
        searchQuery: string | null;
    }) {
        this.status = status;
        this.page = page;
        this.pageSize = pageSize;
        this.searchQuery = searchQuery;
    }

    toJson(): JsonObj {
        return {
            status: this.status ? this.status.value : null,
            page: this.page,
            pageSize: this.pageSize,
            searchQuery: this.searchQuery
        }
    }
}

export class CourseItem {
    id: number;
    permalink: string;
    name: string;
    internalName: string | null;
    courseCode: string;
    courseStatus: CourseStatus;
    avatarColor: AvatarColor;
    totalAssessments: number;
    totalSurveys: number;
    completedAssessments: number;
    completedSurveys: number;
    averagePercentage: number;

    get totalItems(): number {
        return this.totalAssessments + this.totalSurveys;
    }

    get completedItems(): number {
        return this.completedAssessments + this.completedSurveys;
    }

    get progress(): number {
        if(true) {
            return 0;
        }
        return this.totalItems > 0 ? (this.completedItems / this.totalItems) * 100 : 0;
    }

    constructor({
        id,
        permalink,
        name,
        internalName,
        courseCode,
        courseStatus,
        avatarColor,
        totalAssessments,
        totalSurveys,
        completedAssessments,
        completedSurveys,
        averagePercentage
    }: {
        id: number;
        permalink: string;
        name: string;
        internalName: string | null;
        courseCode: string;
        courseStatus: CourseStatus;
        avatarColor: AvatarColor;
        totalAssessments: number;
        totalSurveys: number;
        completedAssessments: number;
        completedSurveys: number;
        averagePercentage: number;
    }) {
        this.id = id;
        this.permalink = permalink;
        this.name = name;
        this.internalName = internalName;
        this.courseCode = courseCode;
        this.courseStatus = courseStatus;
        this.avatarColor = avatarColor;
        this.totalAssessments = totalAssessments;
        this.totalSurveys = totalSurveys;
        this.completedAssessments = completedAssessments;
        this.completedSurveys = completedSurveys;
        this.averagePercentage = averagePercentage;
    }

    static fromJson(json: JsonObj): CourseItem {
        return new CourseItem({
            id: Number(json.id),
            permalink: String(json.permalink),
            name: String(json.name),
            internalName: json.internalName ? String(json.internalName) : null,
            courseCode: String(json.courseCode),
            courseStatus: CourseStatus.fromValue(String(json.courseStatus)),
            avatarColor: AvatarColor.fromJson(json.avatarColor as JsonObj),
            totalAssessments: Number(json.totalAssessments),
            totalSurveys: Number(json.totalSurveys),
            completedAssessments: Number(json.completedAssessments),
            completedSurveys: Number(json.completedSurveys),
            averagePercentage: Number(json.averagePercentage),
        });
    }
}

export class CourseListingRes {
    items: CourseItem[];
    pageInfo: PageInfo;

    constructor({
        items,
        pageInfo
    }: {
        items: CourseItem[];
        pageInfo: PageInfo;
    }) {
        this.items = items;
        this.pageInfo = pageInfo;
    }

    static fromJson(json: JsonObj): CourseListingRes {
        return new CourseListingRes({
            items: (json.items as JsonObj[]).map(item => CourseItem.fromJson(item)),
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
        });
    }
}