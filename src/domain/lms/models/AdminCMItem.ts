import { JsonObj } from "~/core/types/Json";
import { SpaceMemberRole } from "./SpaceMemberRole";

export interface AdminCMItemProps {
    id: number;
    userId: number;
    name: string;
    email: string;
    role: SpaceMemberRole;
    joinedAt: Date;
}

export class AdminCMItem {
    id: number;
    userId: number;
    name: string;
    email: string;
    role: SpaceMemberRole;
    joinedAt: Date;

    constructor(props: AdminCMItemProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.name = props.name;
        this.email = props.email;
        this.role = props.role;
        this.joinedAt = props.joinedAt;
    }

    static fromJson(json: JsonObj): AdminCMItem {
        return new AdminCMItem({
            id: Number(json.id),
            userId: Number(json.userId),
            name: String(json.name),
            email: String(json.email),
            role: SpaceMemberRole.fromValue(String(json.courseRole)),
            joinedAt: new Date(String(json.joinedAt)),
        });
    }
}