import { JsonObj } from "~/core/types/Json";
import { AvatarColor } from "~/domain/common/models/AvatarColor";

export class AdminTopicItem {
    id: number;
    orgId: number;
    spaceId: number;
    name: string;
    avatarColor: AvatarColor;
    totalAssessments: number;
    totalSurveys: number;
    createdAt: Date;
    updatedAt: Date;

    constructor({
        id,
        orgId,
        spaceId,
        name,
        avatarColor,
        totalAssessments,
        totalSurveys,
        createdAt,
        updatedAt
    }: {
        id: number;
        orgId: number;
        spaceId: number;
        name: string;
        avatarColor: AvatarColor;
        totalAssessments: number;
        totalSurveys: number;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.id = id;
        this.orgId = orgId;
        this.spaceId = spaceId;
        this.name = name;
        this.avatarColor = avatarColor;
        this.totalAssessments = totalAssessments;
        this.totalSurveys = totalSurveys;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromJson(json: JsonObj): AdminTopicItem {
        return new AdminTopicItem({
            id: Number(json.id),
            orgId: Number(json.orgId),
            spaceId: Number(json.spaceId),
            name: String(json.name),
            avatarColor: AvatarColor.fromJson(json.avatarColor as JsonObj),
            totalAssessments: Number(json.totalAssessments),
            totalSurveys: Number(json.totalSurveys),
            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt)),
        });
    }
}