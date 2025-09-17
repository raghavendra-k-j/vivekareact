import { JsonObj } from "~/core/types/Json";
import { CourseStatus } from "./CourseStatus";

export class AdminCourseDetail {

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

    static fromJson(json: JsonObj): AdminCourseDetail {
        return new AdminCourseDetail({
            id: Number(json.id),
            orgId: Number(json.orgId),
            name: String(json.name),
            internalName: json.internalName ? String(json.internalName) : null,
            code: json.code ? String(json.code) : null,
            status: CourseStatus.fromValue(String(json.status)),
            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt)),
            totalAdmins: Number(json.totalAdmins),
            totalUsers: Number(json.totalUsers),
            totalAssessments: Number(json.totalAssessments),
            totalSurveys: Number(json.totalSurveys),
        });
    }

}