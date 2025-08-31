import { JsonObj } from "~/core/types/Json";
import { AssmntType } from "~/domain/forms/models/AssmntType";

type QueryFormsToCompareReqProps = {
    formId: number;
    searchQuery: string | null;
    assessmentType: AssmntType | null;
    page: number;
    pageSize: number;
}

export class QueryFormsToCompareReq {
    formId: number;
    searchQuery: string | null;
    assessmentType: AssmntType | null;
    page: number;
    pageSize: number;

    constructor(props: QueryFormsToCompareReqProps) {
        this.formId = props.formId;
        this.searchQuery = props.searchQuery;
        this.assessmentType = props.assessmentType;
        this.page = props.page;
        this.pageSize = props.pageSize;
    }

    toJson(): JsonObj {
        return {
            formId: this.formId,
            searchQuery: this.searchQuery,
            assessmentType: this.assessmentType?.type,
            page: this.page,
            pageSize: this.pageSize
        }
    }
}