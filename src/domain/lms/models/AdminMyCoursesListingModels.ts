import { JsonObj } from "~/core/types/Json";
import { PageInfo } from "~/domain/common/models/PageInfo";
import { AdminMyCourseItem } from "./AdminMyCourseItem";
import { CourseStatus } from "./CourseStatus";

export interface AdminQueryMyCoursesReqProps {
    page: number | null;
    pageSize: number | null;
    searchQuery: string | null;
    courseStatus: CourseStatus | null;
}

export class AdminQueryMyCoursesReq {
    public page: number | null;
    public pageSize: number | null;
    public searchQuery: string | null;
    public courseStatus: CourseStatus | null;

    constructor(props: AdminQueryMyCoursesReqProps) {
        this.page = props.page;
        this.pageSize = props.pageSize;
        this.searchQuery = props.searchQuery;
        this.courseStatus = props.courseStatus;
    }

    toJson(): JsonObj {
        return {
            page: this.page,
            pageSize: this.pageSize,
            searchQuery: this.searchQuery,
            courseStatus: this.courseStatus ? this.courseStatus.value : null
        };
    }
}

export interface AdminQueryMyCoursesResProps {
    pageInfo: PageInfo;
    items: AdminMyCourseItem[];
}

export class AdminQueryMyCoursesRes {
    public pageInfo: PageInfo;
    public items: AdminMyCourseItem[];

    constructor(props: AdminQueryMyCoursesResProps) {
        this.pageInfo = props.pageInfo;
        this.items = props.items;
    }

    static fromJson(json: JsonObj): AdminQueryMyCoursesRes {
        return new AdminQueryMyCoursesRes({
            pageInfo: PageInfo.fromJson(json.pageInfo as JsonObj),
            items: (json.items as JsonObj[]).map(item => AdminMyCourseItem.fromJson(item))
        });
    }
}