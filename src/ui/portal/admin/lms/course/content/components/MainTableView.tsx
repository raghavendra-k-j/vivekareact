import { DateFmt } from "~/core/utils/DateFmt";
import { AdminCCItem } from "~/domain/lms/models/AdminCCItem";
import {
    EasyTableColumn,
    EasyTableEmptyState
} from "~/ui/components/easytable";
import { AdminFormStatusBadge } from "~/ui/components/form/commons/AdminFormStatusBadge";
import { FormAvatar } from "~/ui/components/form/commons/FormAvatar";
import { FormTypeBade as FormTypeBadge } from "~/ui/components/form/commons/FormTypeBadge";
import { LMSTableWrapper } from "../../../home/components/LMSTableWrapper";
import { getLMSPageSizeOptions, useLMSTableConfig } from "../../../home/hooks/useLMSTableConfig";
import { useContentStore } from "../ContentContext";

export function MainTableView() {
    const store = useContentStore();

    const { tableProps } = useLMSTableConfig({
        onReload: () => store.reloadCurrentState(),
        onPageChange: (page: number) => store.changePage(page),
    });

    const renderEmptyState = () => (
        <EasyTableEmptyState
            message="No content found"
            description="Get started by creating your first assessment or survey"
        />
    );

    const dataColumns: EasyTableColumn<AdminCCItem>[] = [
        {
            key: "title",
            header: "Title",
            renderCell: (item) => <ItemTitleCell item={item} />,
            flex: true,
            minWidth: "200px",
        },
        {
            key: "topic",
            header: "Topic",
            renderCell: (item) => item.topic?.name || "-",
            width: "150px",
        },
        {
            key: "type",
            header: "Type",
            renderCell: (item) => <FormTypeBadge type={item.type} size="xs" />,
            width: "120px",
        },
        {
            key: "status",
            header: "Status",
            renderCell: (item) => <AdminFormStatusBadge status={item.adminFormStatus} size="xs" />,
            width: "120px",
        },
        {
            key: "questions",
            header: "Questions",
            renderCell: (item) => item.totalQuestions.toString(),
            width: "100px",
            align: "center",
        },
        {
            key: "responses",
            header: "Responses",
            renderCell: (item) => item.totalResponses.toString(),
            width: "100px",
            align: "center",
        },
        {
            key: "created",
            header: "Created",
            renderCell: (item) => (
                <span title={DateFmt.datetime(item.createdAt)}>
                    {DateFmt.date(item.createdAt)}
                </span>
            ),
            width: "140px",
        },
    ];

    return (
        <LMSTableWrapper<AdminCCItem>
            columns={dataColumns}
            dataState={() => store.queryState}
            getRowKey={(item: AdminCCItem) => item.id.toString()}
            renderEmptyState={renderEmptyState}
            {...tableProps}
            pageSizeOptions={() => getLMSPageSizeOptions(store.pageSize, (size) => store.changePageSize(size))}
        />
    );
}

function ItemTitleCell({ item }: { item: AdminCCItem }) {
    return (
        <div className="flex items-center gap-2.5 py-1">
            <FormAvatar formType={item.type} />
            <div>
                <div className="text-sm font-medium text-default leading-tight">{item.title}</div>
            </div>
        </div>
    );
}