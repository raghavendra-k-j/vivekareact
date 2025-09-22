import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { AdminCourseDetail } from "~/domain/lms/models/AdminCourseDetail";
import { LMSFolderInfo } from "~/domain/lms/models/LMSFolderInfo";
import { AvatarColor } from "~/domain/common/models/AvatarColor";
import { ShortUserInfo } from "~/domain/common/models/ShortUserInfo";

export class AdminCourseDetailVm {
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

    static fromModel(model: AdminCourseDetail): AdminCourseDetailVm {
        return new AdminCourseDetailVm({
            id: model.id,
            orgId: model.orgId,
            permalink: model.permalink,
            name: model.name,
            internalName: model.internalName,
            folderInfo: model.folderInfo,
            totalAdmins: model.totalAdmins,
            totalUsers: model.totalUsers,
            totalAssessments: model.totalAssessments,
            totalSurveys: model.totalSurveys,
            courseCode: model.courseCode,
            courseUserPassword: model.courseUserPassword,
            courseStatus: model.courseStatus,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            creator: model.creator,
            lastModifier: model.lastModifier,
            avatarColor: model.avatarColor,
        });
    }

    get displayName(): string {
        return this.internalName || this.name;
    }
}