import { JsonObj } from "~/core/types/Json";
import { AvatarColor } from "~/domain/common/models/AvatarColor";

export class UpsertTopicReq {
    spaceId: number;
    topicId?: number;
    name: string;
    avatarColor?: AvatarColor;

    constructor({
        spaceId,
        topicId,
        name,
        avatarColor
    }: {
        spaceId: number;
        topicId?: number;
        name: string;
        avatarColor?: AvatarColor;
    }) {
        this.spaceId = spaceId;
        this.topicId = topicId;
        this.name = name;
        this.avatarColor = avatarColor;
    }

    toJson(): JsonObj {
        return {
            spaceId: this.spaceId,
            topicId: this.topicId,
            name: this.name,
            avatarColor: this.avatarColor?.toJson(),
        };
    }
}