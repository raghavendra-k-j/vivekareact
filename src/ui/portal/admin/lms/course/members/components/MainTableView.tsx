import { Observer } from "mobx-react-lite";
import { DateFmt } from "~/core/utils/DateFmt";
import { AdminCMItem } from "~/domain/lms/models/AdminCMItem";
import {
    EasyTableColumn,
    EasyTableEmptyState
} from "~/ui/components/easytable";
import { Badge } from "~/ui/widgets/badges/Badge";
import { CheckMark } from "~/ui/widgets/form/CheckMark";
import { UserAvatar } from "~/ui/portal/components/avatar/UserAvatar";
import { LMSTableWrapper } from "../../../home/components/LMSTableWrapper";
import { getLMSPageSizeOptions, useLMSTableConfig } from "../../../home/hooks/useLMSTableConfig";
import { useMembersStore } from "../MembersContext";

export function MainTableView() {
    const store = useMembersStore();

    const { tableProps } = useLMSTableConfig({
        onReload: () => store.reloadCurrentState(),
        onPageChange: (page: number) => store.changePage(page),
    });

    const renderEmptyState = () => (
        <EasyTableEmptyState
            message="No members found"
            description="Add members to get started"
        />
    );

    const dataColumns: EasyTableColumn<AdminCMItem>[] = [
        {
            key: "select",
            header: (
                <Observer>
                    {() => (
                        <CheckMark
                            value={store.queryState.isData && store.queryState.data!.items.length > 0 && store.selectedItems.size === store.queryState.data!.items.length}
                            onChange={() => store.toggleSelectAll()}
                        />
                    )}
                </Observer>
            ),
            renderCell: (item) => (
                <Observer>
                    {() => (
                        <CheckMark
                            value={store.selectedItems.has(item.id)}
                            onChange={() => store.toggleSelectItem(item.id)}
                        />
                    )}
                </Observer>
            ),
            width: "48px",
            align: "center",
        },
        {
            key: "member",
            header: "Member",
            renderCell: (item) => <MemberCell item={item} />,
            flex: true,
            minWidth: "200px",
        },
        {
            key: "email",
            header: "Email",
            renderCell: (item) => item.email,
            minWidth: "200px",
        },
        {
            key: "role",
            header: "Role",
            renderCell: (item) => (
                <Badge
                    variant="soft"
                    color={item.role.isAdmin ? "primary" : "secondary"}
                    size="xs"
                >
                    {item.role.label}
                </Badge>
            ),
            width: "100px",
        },
        {
            key: "joined",
            header: "Joined",
            renderCell: (item) => (
                <span title={DateFmt.datetime(item.joinedAt)}>
                    {DateFmt.date(item.joinedAt)}
                </span>
            ),
            width: "140px",
        },
    ];

    return (
        <LMSTableWrapper<AdminCMItem>
            columns={dataColumns}
            dataState={() => store.queryState}
            getRowKey={(item: AdminCMItem) => item.id.toString()}
            renderEmptyState={renderEmptyState}
            {...tableProps}
            pageSizeOptions={() => getLMSPageSizeOptions(store.pageSize, (size) => store.changePageSize(size))}
        />
    );
}

function MemberCell({ item }: { item: AdminCMItem }) {
    return (
        <div className="flex items-center gap-2.5 py-1">
            <UserAvatar id={item.id} name={item.name} />
            <div className="min-w-0 leading-tight">
                <div className="text-sm font-medium text-default truncate">{item.name}</div>
            </div>
        </div>
    );
}