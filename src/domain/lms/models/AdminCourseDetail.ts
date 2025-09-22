import { JsonObj } from "~/core/types/Json";
import { CourseStatus } from "./CourseStatus";
import { LMSFolderInfo } from "./LMSFolderInfo";
import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { ShortUserInfo } from "~/domain/common/models/ShortUserInfo";

export class AdminCourseDetail {

    id: number;
    orgId: number;
    permalink: string;
    name: string;
    internalName: string | null;

    folderInfo: LMSFolderInfo | null;

    totalAdmins: number;
    totalUsers: number;
    totalAssessments: number;
    totalSurveys: number;

    courseCode: string;
    courseUserPassword: string | null;

    courseStatus: CourseStatus;
    createdAt: Date;
    updatedAt: Date;
    creator: ShortUserInfo;
    lastModifier: ShortUserInfo;
    avatarColor: AvatarColor;

    constructor({
        id,
        orgId,
        permalink,
        name,
        internalName,
        folderInfo,
        totalAdmins,
        totalUsers,
        totalAssessments,
        totalSurveys,
        courseCode,
        courseUserPassword,
        courseStatus,
        createdAt,
        updatedAt,
        creator,
        lastModifier,
        avatarColor,
    }: {
        id: number;
        orgId: number;
        permalink: string;
        name: string;
        internalName: string | null;
        folderInfo: LMSFolderInfo | null;
        totalAdmins: number;
        totalUsers: number;
        totalAssessments: number;
        totalSurveys: number;
        courseCode: string;
        courseUserPassword: string | null;
        courseStatus: CourseStatus;
        createdAt: Date;
        updatedAt: Date;
        creator: ShortUserInfo;
        lastModifier: ShortUserInfo;
        avatarColor: AvatarColor;
    }) {
        this.id = id;
        this.orgId = orgId;
        this.permalink = permalink;
        this.name = name;
        this.internalName = internalName;
        this.folderInfo = folderInfo;
        this.totalAdmins = totalAdmins;
        this.totalUsers = totalUsers;
        this.totalAssessments = totalAssessments;
        this.totalSurveys = totalSurveys;
        this.courseCode = courseCode;
        this.courseUserPassword = courseUserPassword;
        this.courseStatus = courseStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.creator = creator;
        this.lastModifier = lastModifier;
        this.avatarColor = avatarColor;
    }

    static fromJson(json: JsonObj): AdminCourseDetail {
        return new AdminCourseDetail({
            id: Number(json.id),
            orgId: Number(json.orgId),
            permalink: String(json.permalink),
            name: String(json.name),
            internalName: json.internalName ? String(json.internalName) : null,
            folderInfo: json.folderInfo ? LMSFolderInfo.fromJson(json.folderInfo as JsonObj) : null,
            totalAdmins: Number(json.totalAdmins),
            totalUsers: Number(json.totalUsers),
            totalAssessments: Number(json.totalAssessments),
            totalSurveys: Number(json.totalSurveys),
            courseCode: String(json.courseCode),
            courseUserPassword: json.courseUserPassword ? String(json.courseUserPassword) : null,
            courseStatus: CourseStatus.fromValue(String(json.courseStatus)),
            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt)),
            creator: ShortUserInfo.fromJson(json.creator as JsonObj),
            lastModifier: ShortUserInfo.fromJson(json.lastModifier as JsonObj),
            avatarColor: AvatarColor.fromJson(json.avatarColor as JsonObj),
        });
    }

}