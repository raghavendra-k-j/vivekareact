import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { AdminCourseDetail } from "~/domain/lms/models/AdminCourseDetail";

export class CourseDetailVM {
    id: number;
    orgId: number;
    name: string;
    internalName: string | null;
    code: string | null;
    status: CourseStatus;
    createdAt: Date;
    updatedAt: Date;
    totalAdmins: number;
    totalUsers: number;
    totalAssessments: number;
    totalSurveys: number;

    constructor({
        id,
        orgId,
        name,
        internalName,
        code,
        status,
        createdAt,
        updatedAt,
        totalAdmins,
        totalUsers,
        totalAssessments,
        totalSurveys,
    }: {
        id: number;
        orgId: number;
        name: string;
        internalName: string | null;
        code: string | null;
        status: CourseStatus;
        createdAt: Date;
        updatedAt: Date;
        totalAdmins: number;
        totalUsers: number;
        totalAssessments: number;
        totalSurveys: number;
    }) {
        this.id = id;
        this.orgId = orgId;
        this.name = name;
        this.internalName = internalName;
        this.code = code;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.totalAdmins = totalAdmins;
        this.totalUsers = totalUsers;
        this.totalAssessments = totalAssessments;
        this.totalSurveys = totalSurveys;
    }

    static fromModel(model: AdminCourseDetail): CourseDetailVM {
        return new CourseDetailVM({
            id: model.id,
            orgId: model.orgId,
            name: model.name,
            internalName: model.internalName,
            code: model.code,
            status: model.status,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            totalAdmins: model.totalAdmins,
            totalUsers: model.totalUsers,
            totalAssessments: model.totalAssessments,
            totalSurveys: model.totalSurveys,
        });
    }

    get displayName(): string {
        return this.internalName || this.name;
    }
}