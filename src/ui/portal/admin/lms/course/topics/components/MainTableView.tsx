import { DateFmt } from "~/core/utils/DateFmt";
import { AdminTopicItem } from "~/domain/lms/models/AdminTopicItem";
import {
    EasyTableColumn,
    EasyTableEmptyState
} from "~/ui/components/easytable";
import { LMSTableWrapper } from "../../../home/components/LMSTableWrapper";
import { getLMSPageSizeOptions, useLMSTableConfig } from "../../../home/hooks/useLMSTableConfig";
import { useTopicsStore } from "../TopicsContext";
import { Button } from "~/ui/widgets/button/Button";
import { Observer } from "mobx-react-lite";

export function MainTableView() {
    const store = useTopicsStore();

    const { tableProps } = useLMSTableConfig({
        onReload: () => store.reloadCurrentState(),
        onPageChange: (page: number) => store.changePage(page),
    });

    const renderEmptyState = () => (
        <EasyTableEmptyState
            message="No topics found"
            description="Get started by creating your first topic"
        />
    );

    const dataColumns: EasyTableColumn<AdminTopicItem>[] = [
        {
            key: "name",
            header: "Name",
            renderCell: (item) => <ItemNameCell item={item} />,
            flex: true,
            minWidth: "200px",
        },
        {
            key: "assessments",
            header: "Assessments",
            renderCell: (item) => item.totalAssessments.toString(),
            width: "120px",
            align: "center",
        },
        {
            key: "surveys",
            header: "Surveys",
            renderCell: (item) => item.totalSurveys.toString(),
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
        {
            key: "actions",
            header: "Actions",
            renderCell: (item) => <ActionsCell item={item} />,
            width: "120px",
            align: "center",
        },
    ];

    return (
        <LMSTableWrapper<AdminTopicItem>
            columns={dataColumns}
            dataState={() => store.queryState}
            getRowKey={(item: AdminTopicItem) => item.id.toString()}
            renderEmptyState={renderEmptyState}
            {...tableProps}
            pageSizeOptions={() => getLMSPageSizeOptions(store.pageSize, (size) => store.changePageSize(size))}
        />
    );
}

function ItemNameCell({ item }: { item: AdminTopicItem }) {
    return (
        <div className="flex items-center gap-2.5 py-1">
            <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ backgroundColor: item.avatarColor.bgColor }}
            >
                {item.name.charAt(0).toUpperCase()}
            </div>
            <div>
                <div className="text-sm font-medium text-default leading-tight">{item.name}</div>
            </div>
        </div>
    );
}

function ActionsCell({ item }: { item: AdminTopicItem }) {
    const store = useTopicsStore();

    return (
        <Observer>
            {() => (
                <div className="flex items-center gap-1">
                    <Button
                        size="xs"
                        variant="ghost"
                        color="primary"
                        onClick={() => store.topicDialogStore.openEditDialog(item)}
                        title="Edit topic"
                    >
                        Edit
                    </Button>
                    <Button
                        size="xs"
                        variant="ghost"
                        color="danger"
                        onClick={() => store.topicDialogStore.deleteTopic(item.id)}
                        title="Delete topic"
                    >
                        Delete
                    </Button>
                </div>
            )}
        </Observer>
    );
}