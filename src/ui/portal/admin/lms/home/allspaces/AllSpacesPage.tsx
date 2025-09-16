import { FileText, Folder, MoreVertical } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useEffect } from "react";
import { LMSConst } from "~/domain/lms/models/LMSConst";
import { SpaceType } from "~/domain/lms/models/SpaceType";
import { Button } from "~/ui/widgets/button/Button";
import { Input } from "~/ui/widgets/form/Input";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { Card, CardBody } from "~/ui/components/card";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { AdminPageAppBar, AdminPageAppBarTitle } from "~/ui/portal/admin/components/PageAppBar";
import { AllSpacesProvider, useAllSpacesStore } from "./AllSpacesContext";
import { AdminSpaceItem } from "~/domain/lms/models/AdminSpaceItem";
import { AdminFolderInfo } from "~/domain/lms/models/AdminFolderInfo";

function AllSpacesPageInner() {
    const store = useAllSpacesStore();
    useEffect(() => {
        store.loadItems();
    }, [store]);
    return (
        <div className="flex flex-col h-full">
            <AppBarView />
            <Observer>
                {() => {
                    return store.queryState.stateWhen({
                        initOrLoading: () => <ShimmerTable />,
                        error: (error) => (
                            <div className="flex-1 p-4">
                                <SimpleRetryableAppView
                                    appError={error}
                                    onRetry={() => store.reloadCurrentFolder()}
                                />
                            </div>
                        ),
                        loaded: () => <ItemsListView />,
                    });
                }}
            </Observer>
        </div>
    );
}

export function AllSpacesPage() {
    return (
        <AllSpacesProvider>
            <AllSpacesPageInner />
        </AllSpacesProvider>
    );
}

function AppBarView() {
    const store = useAllSpacesStore();
    return (
        <AdminPageAppBar
            start={<AdminPageAppBarTitle title="Learning Management System" />}
            end={
                <div className="flex flex-row items-center gap-3">
                    <Input
                        placeholder="Search folders and courses in this directory"
                        type="search"
                        className="w-64 sm:w-80 md:w-96 lg:w-[28rem] xl:w-[32rem]"
                        inputSize="md"
                    />
                    <Button
                        color="secondary"
                        variant="outline"
                        onClick={() => store.showCreateDialog(SpaceType.FOLDER)}
                        size="md"
                    >
                        New Folder
                    </Button>
                    <Button
                        color="primary"
                        variant="solid"
                        onClick={() => store.showCreateDialog(SpaceType.COURSE)}
                        size="md"
                    >
                        New {store.layoutStore.entity(LMSConst.ENTITY_COURSE_ID).nameSingular}
                    </Button>
                </div>
            }
            bottom={<BreadcrumbsComponent />}
        />
    );
}

function BreadcrumbsComponent() {
    const store = useAllSpacesStore();

    const buildBreadcrumbPath = (folder: AdminFolderInfo | null): AdminFolderInfo[] => {
        const path: AdminFolderInfo[] = [];
        let current = folder;
        while (current) {
            path.unshift(current);
            current = current.parent;
        }
        return path;
    };

    return (
        <Observer>
            {() => {
                const isLoading = store.queryState.isLoading;
                const hasData = store.queryState.isData;
                const folder = hasData ? store.listVm.folder : null;
                const breadcrumbPath = hasData && folder ? buildBreadcrumbPath(folder) : [];

                return (
                    <div className="px-4 py-2 bg-surface border-t border-default min-h-10">
                        <nav className="flex items-center space-x-1 text-sm">
                            <BreadcrumbItem
                                name="Home"
                                onClick={() => store.navigateToFolder(null)}
                                isLoading={isLoading}
                            />
                            {isLoading && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-tertiary mx-1">/</span>
                                    <BreadcrumbItem
                                        name="loading"
                                        isLoading={true}
                                    />
                                </div>
                            )}
                            {!isLoading && breadcrumbPath.map((folder, index) => (
                                <div key={folder.id} className="flex items-center">
                                    <span className="text-tertiary mx-1">/</span>
                                    <BreadcrumbItem
                                        name={folder.name}
                                        onClick={() => store.navigateToFolder(folder.id)}
                                        isCurrent={index === breadcrumbPath.length - 1}
                                    />
                                </div>
                            ))}
                        </nav>
                    </div>
                );
            }}
        </Observer>
    );
}

function BreadcrumbItem({
    name,
    onClick,
    isCurrent = false,
    isLoading = false
}: {
    name: string;
    onClick?: () => void;
    isCurrent?: boolean;
    isLoading?: boolean;
}) {
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 px-2 py-1">
                <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className={`h-4 bg-gray-200 animate-pulse rounded ${name === 'Home' ? 'w-12' : 'w-16'}`}></div>
            </div>
        );
    }

    const Component = onClick ? 'button' : 'div';
    const baseClasses = "flex items-center gap-2 px-2 py-1 rounded-md font-medium transition-all duration-150";
    const stateClasses = isCurrent
        ? "bg-gray-100 text-gray-900 ring-1 ring-gray-200"
        : onClick
            ? "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            : "text-gray-600";

    return (
        <Component
            onClick={onClick}
            className={`${baseClasses} ${stateClasses}`}
        >
            <Folder className="w-4 h-4 text-amber-600" />
            <span>{name}</span>
        </Component>
    );
}

function ItemsListView() {
    const store = useAllSpacesStore();
    return (
        <div className="flex-1 p-4">
            <Card className="shadow-sm border border-default">
                <CardBody className="p-0">
                    <div className="overflow-hidden">
                        <table className="min-w-full">
                            <TableHeader />
                            <tbody className="bg-background divide-y divide-default">
                                {store.listVm.items.map((item) => (
                                    <TableRow key={item.id} item={item} />
                                ))}
                                {store.listVm.items.length === 0 && (
                                    <EmptyStateRow />
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

function EmptyStateRow() {
    return (
        <tr className="bg-surface">
            <TableCell colSpan={5} className="py-8 text-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center">
                        <Folder className="w-5 h-5 text-tertiary" />
                    </div>
                    <div>
                        <p className="text-default font-medium">No items found</p>
                        <p className="text-secondary text-sm mt-0.5">Create your first course or folder to get started</p>
                    </div>
                </div>
            </TableCell>
        </tr>
    );
}

function TableHeader() {
    return (
        <thead className="bg-surface border-b border-default sticky top-0">
            <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Created</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
        </thead>
    );
}

function TableHeaderCell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`px-4 py-2.5 text-left text-sm font-semibold text-default ${className}`}>
            {children}
        </th>
    );
}

function TableRow({ item }: { item: AdminSpaceItem }) {
    const store = useAllSpacesStore();

    const handleRowClick = () => {
        if (item.type.isFolder) {
            store.navigateToFolder(item.id);
        }
    };

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        console.log('Action clicked for item:', item.id);
    };

    const isCourse = item.type.type === 'course';

    return (
        <tr
            onClick={handleRowClick}
            className="group bg-surface hover:bg-gray-50/15 cursor-pointer transition-all duration-150 border-b border-default/50"
        >
            <TableCell>
                <ItemNameCell item={item} />
            </TableCell>
            <TableCell>
                <ItemTypeBadge type={item.type} />
            </TableCell>
            {isCourse && (
                <TableCell>
                    <ItemStatusBadge status={item.status} />
                </TableCell>
            )}
            {!isCourse && (
                <TableCell>
                    <span className="text-tertiary text-sm font-medium">—</span>
                </TableCell>
            )}
            <TableCell>
                <span className="text-sm text-secondary font-medium">
                    {item.createdAt.toLocaleDateString()}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <ItemActions onActionClick={handleActionClick} />
            </TableCell>
        </tr>
    );
}

function ItemNameCell({ item }: { item: AdminSpaceItem }) {
    return (
        <div className="flex items-center gap-2.5">
            {item.type.type === 'folder' ? (
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

function ItemTypeBadge({ type }: { type: AdminSpaceItem['type'] }) {
    return (
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-surface border border-default text-default">
            {type.label}
        </span>
    );
}

function ItemStatusBadge({ status }: { status: AdminSpaceItem['status'] }) {
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${status.value === 'active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : status.value === 'draft'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-surface text-default border-default'
            }`}>
            {status.label}
        </span>
    );
}

function ItemActions({ onActionClick }: { onActionClick: (e: React.MouseEvent) => void }) {
    return (
        <div className="flex justify-end">
            <IconButton
                icon={<MoreVertical className="w-4 h-4" />}
                size="sm"
                variant="ghost"
                color="secondary"
                onClick={onActionClick}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            />
        </div>
    );
}

function TableCell({ children, className = "", colSpan }: { children: React.ReactNode; className?: string; colSpan?: number }) {
    return (
        <td className={`px-4 py-2 ${className}`} colSpan={colSpan}>
            {children}
        </td>
    );
}

function ShimmerRow() {
    return (
        <tr className="bg-surface">
            <TableCell>
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-lg"></div>
                    <div>
                        <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <div className="w-16 h-6 bg-gray-200 animate-pulse rounded-full"></div>
            </TableCell>
            <TableCell>
                <div className="w-16 h-6 bg-gray-200 animate-pulse rounded-full"></div>
            </TableCell>
            <TableCell>
                <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
            </TableCell>
            <TableCell className="text-right">
                <div className="w-6 h-6 bg-gray-200 animate-pulse rounded ml-auto"></div>
            </TableCell>
        </tr>
    );
}

function ShimmerTable() {
    return (
        <div className="flex-1 p-4">
            <Card className="shadow-sm border border-default">
                <CardBody className="p-0">
                    <div className="overflow-hidden">
                        <table className="min-w-full">
                            <TableHeader />
                            <tbody className="bg-background divide-y divide-default">
                                {Array.from({ length: 5 }).map((_, i) => <ShimmerRow key={i} />)}
                            </tbody>
                        </table>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}