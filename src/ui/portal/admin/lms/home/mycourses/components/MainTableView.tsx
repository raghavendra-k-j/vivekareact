import { BookOpen, FileText, GraduationCap, Users } from "lucide-react";
import { AdminMyCourseItem } from "~/domain/lms/models/AdminMyCourseItem";
import {
    EasyTableColumn,
    EasyTableEmptyState,
} from "~/ui/components/easytable";
import { CourseStatusBadge } from "~/ui/components/form/commons/CourseStatusBadge";
import { useAdminMyCoursesStore } from "../MyCoursesContext";
import { getLMSPageSizeOptions, useLMSTableConfig } from "../../hooks/useLMSTableConfig";
import { LMSTableWrapper } from "../../components/LMSTableWrapper";

export function MainTableView() {
    const store = useAdminMyCoursesStore();

    const { tableProps } = useLMSTableConfig({
        onReload: () => store.reloadCurrentState(),
        onPageChange: (page: number) => store.changePage(page),
    });

    const handleOnRowClick = (item: AdminMyCourseItem) => {
        store.navigateToCourse(item.id);
    };

    const renderEmptyState = () => (
        <EasyTableEmptyState
            message={`No ${store.layoutStore.ed("lms_course").namePlural.toLowerCase()} found`}
            description="You haven't been assigned to any courses yet"
        />
    );

    const dataColumns: EasyTableColumn<AdminMyCourseItem>[] = [
        {
            key: "name",
            header: "Name",
            renderCell: (item) => <ItemNameCell item={item} />,
            flex: true,
            minWidth: "200px",
        },
        {
            key: "courseCode",
            header: "Course Code",
            renderCell: (item) => (
                <span className="text-sm font-medium text-default">{item.courseCode}</span>
            ),
            width: "120px",
        },
        {
            key: "status",
            header: "Status",
            renderCell: (item) => <CourseStatusBadge status={item.courseStatus} />,
            width: "120px",
        },
        {
            key: "admins",
            header: "Admins",
            renderCell: (item) => (
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-tertiary" />
                    <span className="text-sm text-secondary font-medium">{item.totalAdmins}</span>
                </div>
            ),
            width: "80px",
            align: "center",
        },
        {
            key: "users",
            header: "Users",
            renderCell: (item) => (
                <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-tertiary" />
                    <span className="text-sm text-secondary font-medium">{item.totalUsers}</span>
                </div>
            ),
            width: "80px",
            align: "center",
        },
        {
            key: "assessments",
            header: "Assessments",
            renderCell: (item) => (
                <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-tertiary" />
                    <span className="text-sm text-secondary font-medium">{item.totalAssessments}</span>
                </div>
            ),
            width: "120px",
            align: "center",
        },
        {
            key: "surveys",
            header: "Surveys",
            renderCell: (item) => (
                <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4 text-tertiary" />
                    <span className="text-sm text-secondary font-medium">{item.totalSurveys}</span>
                </div>
            ),
            width: "80px",
            align: "center",
        },
        {
            key: "createdAt",
            header: "Created",
            renderCell: (item) => (
                <span className="text-sm text-secondary font-medium">
                    {item.createdAt.toLocaleDateString()}
                </span>
            ),
            width: "120px",
        },
    ];

    return (
        <LMSTableWrapper<AdminMyCourseItem>
            columns={dataColumns}
            dataState={() => store.queryState}
            getRowKey={(item) => item.id.toString()}
            onRowClick={handleOnRowClick}
            renderEmptyState={renderEmptyState}
            {...tableProps}
            pageSizeOptions={() => getLMSPageSizeOptions(store.pageSize, (size) => store.changePageSize(size))}
        />
    );
}

function ItemNameCell({ item }: { item: AdminMyCourseItem }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg ring-1 ring-blue-200/50">
                <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
                <div className="text-sm font-medium text-default leading-tight">{item.name}</div>
                {item.internalName && (
                    <div className="text-xs text-secondary mt-0.5">{item.internalName}</div>
                )}
            </div>
        </div>
    );
}