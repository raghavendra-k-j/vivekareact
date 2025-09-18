import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminFormStatus } from "../../models/AdminFormStatus";
import { FormStatus } from "../../models/FormStatus";
import { FormType } from "../../models/FormType";
import { CategoryTile } from "./categories/CategoryTile";

export type AdminFormListTileProps = {
    id: number;
    orgId: number;
    type: FormType;
    createdAt: Date;
    updatedAt: Date;
    status: FormStatus;
    adminFormStatus: AdminFormStatus;
    permalink: string;
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    totalQuestions: number;
    totalInvites: number;
    totalResponses: number;
    categories: CategoryTile[];
};

export class AdminFormListTile {
    id: number;
    orgId: number;
    type: FormType;
    createdAt: Date;
    updatedAt: Date;
    status: FormStatus;
    adminFormStatus: AdminFormStatus;
    permalink: string;
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    totalQuestions: number;
    totalInvites: number;
    totalResponses: number;
    categories: CategoryTile[];

    constructor(props: AdminFormListTileProps) {
        this.id = props.id;
        this.orgId = props.orgId;
        this.type = props.type;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.status = props.status;
        this.adminFormStatus = props.adminFormStatus;
        this.permalink = props.permalink;
        this.title = props.title;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
        this.totalQuestions = props.totalQuestions;
        this.totalInvites = props.totalInvites;
        this.totalResponses = props.totalResponses;
        this.categories = props.categories;
    }

    static fromJson(json: JsonObj, now: Date): AdminFormListTile {
        const dbStatus = FormStatus.fromValue(json.status);
        const startDate = json.startDate ? new Date(json.startDate) : null;
        const endDate = json.endDate ? new Date(json.endDate) : null;
        const adminFormStatus = AdminFormStatus.fromDbStatus({
            dbStatus: dbStatus,
            startDate: startDate,
            endDate: endDate,
            now: now,
        });
        const categories: CategoryTile[] = [];
        if (json.categories && Array.isArray(json.categories)) {
            json.categories.forEach((cat: JsonObj) => {
                categories.push(CategoryTile.fromJson(cat));
            });
        }

        return new AdminFormListTile({
            id: Number(json.id),
            orgId: Number(json.orgId),
            type: FormType.fromType(json.type)!,
            createdAt: new Date(json.createdAt),
            updatedAt: new Date(json.updatedAt),
            status: FormStatus.fromValue(json.status),
            adminFormStatus: adminFormStatus,
            permalink: String(json.permalink),
            title: String(json.title),
            startDate: startDate,
            endDate: endDate,
            totalQuestions: Number(json.totalQuestions),
            totalInvites: Number(json.totalInvites),
            totalResponses: Number(json.totalResponses),
            categories: categories,
        });
    }
}

export type AdminQueryFormsResProps = {
    items: AdminFormListTile[];
    pageInfo: PageInfo;
};

export class AdminQueryFormsRes {
    items: AdminFormListTile[];
    pageInfo: PageInfo;

    constructor(props: AdminQueryFormsResProps) {
        this.items = props.items;
        this.pageInfo = props.pageInfo;
    }

    static fromJson(json: JsonObj): AdminQueryFormsRes {
        const pageInfo = PageInfo.fromJson(json.pageInfo);
        const now = new Date();
        const items: AdminFormListTile[] = [];
        if (Array.isArray(json.items)) {
            json.items.forEach((item: JsonObj) => {
                items.push(AdminFormListTile.fromJson(item, now));
            });
        }
        return new AdminQueryFormsRes({
            items: items,
            pageInfo: pageInfo
        });
    }
}


export class AdminQueryFormsReq {

    formType: FormType | null;
    adminFormStatus: AdminFormStatus | null;
    categoryIds: number[] | null;
    searchQuery: string | null;
    page: number;
    pageSize: number;

    constructor(props: {
        formType: FormType | null;
        adminFormStatus: AdminFormStatus | null;
        categoryIds: number[] | null;
        searchQuery: string | null;
        page: number;
        pageSize: number;
    }) {
        this.formType = props.formType,
            this.adminFormStatus = props.adminFormStatus,
            this.categoryIds = props.categoryIds,
            this.searchQuery = props.searchQuery,
            this.page = props.page,
            this.pageSize = props.pageSize
    }

    toJson(): JsonObj {
        return {
            formType: this.formType ? this.formType.type : 'all',
            adminFormStatus: this.adminFormStatus ? this.adminFormStatus.status : null,
            categoryIds: this.categoryIds,
            searchQuery: this.searchQuery,
            page: this.page,
            pageSize: this.pageSize
        };
    }

}