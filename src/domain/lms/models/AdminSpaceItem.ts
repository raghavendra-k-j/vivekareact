import { JsonObj } from "~/core/types/Json";
import { SpaceType } from "./SpaceType";
import { CourseStatus } from "./CourseStatus";
import { AvatarColor } from "~/domain/common/models/AvatarColor";

export interface AdminSpaceItemProps {
    id: number;
    permalink: string;
    type: SpaceType;
    name: string;
    internalName: string | null;
    parentId: number | null;
    avatarColor: AvatarColor;
    courseStatus: CourseStatus | null;
    createdAt: Date;
    updatedAt: Date;
}

export class AdminSpaceItem {
    public id: number;
    public permalink: string;
    public type: SpaceType;
    public name: string;
    public internalName: string | null;
    public parentId: number | null;
    public avatarColor: AvatarColor;
    public courseStatus: CourseStatus | null;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: AdminSpaceItemProps) {
        this.id = props.id;
        this.permalink = props.permalink;
        this.type = props.type;
        this.name = props.name;
        this.internalName = props.internalName;
        this.parentId = props.parentId;
        this.avatarColor = props.avatarColor;
        this.courseStatus = props.courseStatus;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static fromJson(json: JsonObj): AdminSpaceItem {
        return new AdminSpaceItem({
            id: Number(json.id),
            permalink: String(json.permalink),
            type: SpaceType.fromValue(String(json.type)),
            name: String(json.name),
            internalName: json.internalName ? String(json.internalName) : null,
            parentId: json.parentId ? Number(json.parentId) : null,
            avatarColor: AvatarColor.fromJson(json.avatarColor as JsonObj),
            courseStatus: json.courseStatus ? CourseStatus.fromValue(String(json.courseStatus)) : null,
            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt))
        });
    }
}
