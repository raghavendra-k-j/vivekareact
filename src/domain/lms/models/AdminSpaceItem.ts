import { JsonObj } from "~/core/types/Json";
import { SpaceType } from "./SpaceType";
import { CourseStatus } from "./CourseStatus";

export interface AdminSpaceItemProps {
    id: number;
    orgId: number;
    type: SpaceType;
    name: string;
    internalName: string | null;
    code: string | null;
    parentId: number | null;
    status: CourseStatus;
    createdAt: Date;
    updatedAt: Date;
}

export class AdminSpaceItem {
    public id: number;
    public orgId: number;
    public type: SpaceType;
    public name: string;
    public internalName: string | null;
    public code: string | null;
    public parentId: number | null;
    public status: CourseStatus;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(props: AdminSpaceItemProps) {
        this.id = props.id;
        this.orgId = props.orgId;
        this.type = props.type;
        this.name = props.name;
        this.internalName = props.internalName;
        this.code = props.code;
        this.parentId = props.parentId;
        this.status = props.status;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    static fromJson(json: JsonObj): AdminSpaceItem {
        return new AdminSpaceItem({
            id: Number(json.id),
            orgId: Number(json.orgId),
            type: SpaceType.fromValue(String(json.type)),
            name: String(json.name),
            internalName: json.internalName ? String(json.internalName) : null,
            code: json.code ? String(json.code) : null,
            parentId: json.parentId ? Number(json.parentId) : null,
            status: CourseStatus.fromValue(String(json.status)),
            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt))
        });
    }
}
