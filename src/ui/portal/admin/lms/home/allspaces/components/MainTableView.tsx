import { FileText, Folder, Pencil, Trash2 } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import {
    EasyTableAction,
    EasyTableActions,
    EasyTableColumn,
    EasyTableEmptyState,
    EasyTableSelect,
} from "~/ui/components/easytable";
import { CourseStatusBadge } from "~/ui/components/form/commons/CourseStatusBadge";
import { SelectAllState } from "~/ui/utils/SelectAllState";
import { Badge } from "~/ui/widgets/badges/Badge";
import { LMSTableWrapper } from "../../components/LMSTableWrapper";
import { getLMSPageSizeOptions, useLMSTableConfig } from "../../hooks/useLMSTableConfig";
import { useAllSpacesStore } from "../AllSpacesContext";
import { useLMSStore } from "../../../layout/LMSLayoutContext";

export function MainTableView() {
    const store = useAllSpacesStore();
    const lmsLayoutStore = useLMSStore();


    const { tableProps } = useLMSTableConfig({
        onReload: () => store.reloadCurrentState(),
        onPageChange: (page: number) => store.changePage(page),
    });

    const handleOnRowClick = (item: AdminSpaceItem) => {
        if (store.selectedItemIds.size > 0) {
            store.toggleItemSelection({ itemId: item.id });
            return;
        }
        store.onClickTableRow(item);
    }

    // No folders or courses found
    const renderEmptyState = () => (
        <EasyTableEmptyState
            message={`No ${SpaceType.FOLDER.labelPlural.toLowerCase()} or ${lmsLayoutStore.courseLabelPlural.toLowerCase()} found`}
            description={`Get started by creating your first ${SpaceType.FOLDER.label.toLowerCase()} or ${lmsLayoutStore.courseLabelSingular.toLowerCase()}`}
        />
    );

    const dataColumns: EasyTableColumn<AdminSpaceItem>[] = [
        {
            key: "_select_",
            header: "",
            renderCell: (item) => (<Observer>{() => <EasyTableSelect
                selected={store.selectedItemIds.has(item.id)}
                onChange={(selected) => store.toggleItemSelection({ itemId: item.id, selected })}
            />}
            </Observer>),
            renderHeader: () => (<Observer>{() => <EasyTableSelect
                selected={store.selectAllState === SelectAllState.ALL}
                intermediate={store.selectAllState === SelectAllState.SOME}
                onChange={() => store.selectAllState === SelectAllState.ALL ? store.clearSelection() : store.selectAllItems()}
            />}
            </Observer>),
            width: "20px",
            align: "center",
            headerAlign: "center"
        },
        {
            key: "name",
            header: "Name",
            renderCell: (item) => <ItemNameCell item={item} />,
            flex: true,
            minWidth: "200px",
        },
        {
            key: "type",
            header: "Type",
            renderCell: (item) => <ItemTypeBadge type={item.type} />,
            width: "120px",
        },
        {
            key: "status",
            header: "Status",
            renderCell: (item) => <ItemStatusBadge status={item.courseStatus} />,
            width: "120px",
        },
        {
            key: "actions",
            header: "Actions",
            renderCell: (item) => <ItemActions item={item} />,
            width: "100px",
            align: "right",
            headerAlign: "right"
        },
    ];

    return (
        <LMSTableWrapper<AdminSpaceItem>
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



function ItemNameCell({ item }: { item: AdminSpaceItem }) {
    return (
        <div className="flex items-center gap-2.5">
            {item.type.value === 'folder' ? (
                <div className="flex items-center justify-center w-8 h-8 bg-amber-50 rounded-lg ring-1 ring-amber-200/50">
                    <Folder className="w-4 h-4 text-amber-600" />
                </div>
            ) : (
                <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg ring-1 ring-blue-200/50">
                    <FileText className="w-4 h-4 text-blue-600" />
                </div>
            )}
            <div>
                <div className="text-sm font-medium text-default leading-tight">{item.name}</div>
            </div>
        </div>
    );
}

function ItemTypeBadge({ type }: { type: SpaceType }) {
    return (
        <Badge variant="outline" color="gray" rounded="full">
            {type.label}
        </Badge>
    );
}

function ItemStatusBadge({ status }: { status: CourseStatus | null }) {
    if (!status) {
        return null;
    }
    return (<CourseStatusBadge status={status} />);
}

function ItemActions({ item }: { item: AdminSpaceItem }) {
    const store = useAllSpacesStore();

    const actions: EasyTableAction[] = [
        {
            key: "rename",
            label: "Rename",
            icon: <Pencil className="w-4 h-4" />,
            onClick: () => store.showRenameDialog(item),
        },
        {
            key: "delete",
            label: "Delete",
            icon: <Trash2 className="w-4 h-4" />,
            variant: "destructive",
            onClick: () => store.showDeleteDialog(item),
        },
    ];

    return <EasyTableActions actions={actions} />;
}