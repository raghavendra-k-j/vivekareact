import { JsonObj } from "~/core/types/Json";
import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";


export class CourseDetail {
    id: number;
    permalink: string
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

    static fromJson(json: JsonObj): CourseDetail {
        return new CourseDetail({
            id: Number(json.id),
            permalink: String(json.permalink),
            courseCode: String(json.courseCode),
            name: String(json.name),
            courseStatus: CourseStatus.fromValue(String(json.courseStatus)),
            avatarColor: AvatarColor.fromJson(json.avatarColor as JsonObj),
            totalAdmins: Number(json.totalAdmins),
            totalUsers: Number(json.totalUsers),
            totalAssessments: Number(json.totalAssessments),
            totalSurveys: Number(json.totalSurveys),
            completedAssessments: Number(json.completedAssessments),
            completedSurveys: Number(json.completedSurveys),
            averagePercentage: Number(json.averagePercentage),
            rank: Number(json.rank),
            createdAt: new Date(json.createdAt as string),
            updatedAt: new Date(json.updatedAt as string),
        });
    }
}

