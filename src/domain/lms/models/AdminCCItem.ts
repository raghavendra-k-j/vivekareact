import { JsonObj } from "~/core/types/Json";
import { FormType } from "~/domain/forms/models/FormType";
import { TopicBase } from "./TopicBase";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { FormStatus } from "~/domain/forms/models/FormStatus";


export interface AdminCCItemProps {
    id: number;
    type: FormType;
    status: FormStatus;
    adminFormStatus: AdminFormStatus;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date | null;
    endDate: Date | null;
    spaceId: number;
    topic: TopicBase | null;
    totalQuestions: number;
    totalResponses: number;
}

export class AdminCCItem {

    id: number;
    type: FormType;
    status: FormStatus;
    adminFormStatus: AdminFormStatus;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date | null;
    endDate: Date | null;
    spaceId: number;
    topic: TopicBase | null;
    totalQuestions: number;
    totalResponses: number;

    constructor(props: AdminCCItemProps) {
        this.id = props.id;
        this.type = props.type;
        this.status = props.status;
        this.adminFormStatus = props.adminFormStatus;
        this.title = props.title;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.spaceId = props.spaceId;
        this.topic = props.topic;
        this.totalQuestions = props.totalQuestions;
        this.totalResponses = props.totalResponses;
    }

    static fromJson(json: JsonObj, now: Date): AdminCCItem {
        const type = FormType.fromType(String(json.type))!;
        const status = FormStatus.fromValue(String(json.status))!;
        const startDate = json.startDate ? new Date(String(json.startDate)) : null;
        const endDate = json.endDate ? new Date(String(json.endDate)) : null;
        const adminFormStatus = AdminFormStatus.fromDbStatus({
            dbStatus: status,
            now: now,
            startDate: startDate,
            endDate: endDate,
        });
        return new AdminCCItem({
            id: Number(json.id),
            type: type,
            status: status,
            adminFormStatus: adminFormStatus,
            title: String(json.title),
            createdAt: new Date(String(json.createdAt)),
            updatedAt: new Date(String(json.updatedAt)),
            startDate: json.startDate ? new Date(String(json.startDate)) : null,
            endDate: json.endDate ? new Date(String(json.endDate)) : null,
            spaceId: Number(json.spaceId),
            topic: json.topic ? TopicBase.fromJson(json.topic as JsonObj) : null,
            totalQuestions: Number(json.totalQuestions),
            totalResponses: Number(json.totalResponses),
        });
    }
}
