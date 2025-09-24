import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { CourseDetail } from "~/domain/userapp/models/CourseDetail";

export class CourseDetailVm {
    id: number;
    permalink: string;
    courseCode: string;
    name: string;
    courseStatus: CourseStatus;
    avatarColor: AvatarColor;
    totalAdmins: number;
    totalUsers: number;
    totalAssessments: number;
    totalSurveys: number;
    completedAssessments: number;
    completedSurveys: number;
    averagePercentage: number;
    rank: number;
    createdAt: Date;
    updatedAt: Date;

    constructor({
        id,
        permalink,
        courseCode,
        name,
        courseStatus,
        avatarColor,
        totalAdmins,
        totalUsers,
        totalAssessments,
        totalSurveys,
        completedAssessments,
        completedSurveys,
        averagePercentage,
        rank,
        createdAt,
        updatedAt
    }: {
        id: number;
        permalink: string;
        courseCode: string;
        name: string;
        courseStatus: CourseStatus;
        avatarColor: AvatarColor;
        totalAdmins: number;
        totalUsers: number;
        totalAssessments: number;
        totalSurveys: number;
        completedAssessments: number;
        completedSurveys: number;
        averagePercentage: number;
        rank: number;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = id;
        this.permalink = permalink;
        this.courseCode = courseCode;
        this.name = name;
        this.courseStatus = courseStatus;
        this.avatarColor = avatarColor;
        this.totalAdmins = totalAdmins;
        this.totalUsers = totalUsers;
        this.totalAssessments = totalAssessments;
        this.totalSurveys = totalSurveys;
        this.completedAssessments = completedAssessments;
        this.completedSurveys = completedSurveys;
        this.averagePercentage = averagePercentage;
        this.rank = rank;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get totalItems() {
        return this.totalAssessments + this.totalSurveys;
    }

    get completedItems() {
        return this.completedAssessments + this.completedSurveys;
    }

    get completionPercentage() {
        return this.totalItems > 0 ? (this.completedItems / this.totalItems) * 100 : 0;
    }

    static fromModel(model: CourseDetail): CourseDetailVm {
        return new CourseDetailVm({
            id: model.id,
            permalink: model.permalink,
            courseCode: model.courseCode,
            name: model.name,
            courseStatus: model.courseStatus,
            avatarColor: model.avatarColor,
            totalAdmins: model.totalAdmins,
            totalUsers: model.totalUsers,
            totalAssessments: model.totalAssessments,
            totalSurveys: model.totalSurveys,
            completedAssessments: model.completedAssessments,
            completedSurveys: model.completedSurveys,
            averagePercentage: model.averagePercentage,
            rank: model.rank,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
        });
    }
}