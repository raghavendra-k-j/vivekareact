import { JsonObj } from "~/core/types/Json";
import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { CourseStatus } from "./CourseStatus";

export interface AdminMyCourseItemProps {
    id: number;
    permalink: string;
    name: string;
    internalName: string | null;
    avatarColor: AvatarColor;
    courseCode: string;
    courseStatus: CourseStatus;
    totalAdmins: number;
    totalUsers: number;
    totalAssessments: number;
    totalSurveys: number;
    createdAt: Date;
    updatedAt: Date;
}

export class AdminMyCourseItem {
    public id: number;
    public permalink: string;
    public name: string;
    public internalName: string | null;
    public avatarColor: AvatarColor;
    public courseCode: string;
    public courseStatus: CourseStatus;
    public totalAdmins: number;
    public totalUsers: number;
    public totalAssessments: number;
    public totalSurveys: number;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: AdminMyCourseItemProps) {
        this.id = props.id;
        this.permalink = props.permalink;
        this.name = props.name;
        this.internalName = props.internalName;
        this.avatarColor = props.avatarColor;
        this.courseCode = props.courseCode;
        this.courseStatus = props.courseStatus;
        this.totalAdmins = props.totalAdmins;
        this.totalUsers = props.totalUsers;
        this.totalAssessments = props.totalAssessments;
        this.totalSurveys = props.totalSurveys;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static fromJson(json: JsonObj): AdminMyCourseItem {
        return new AdminMyCourseItem({
            id: Number(json.id),
            permalink: String(json.permalink),
            name: String(json.name),
            internalName: json.internalName ? String(json.internalName) : null,
            avatarColor: AvatarColor.fromJson(json.avatarColor as JsonObj),
            courseCode: String(json.courseCode),
            courseStatus: CourseStatus.fromValue(String(json.courseStatus)),
            totalAdmins: Number(json.totalAdmins),
            totalUsers: Number(json.totalUsers),
            totalAssessments: Number(json.totalAssessments),
            totalSurveys: Number(json.totalSurveys),
            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt))
        });
    }
}