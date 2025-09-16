import clsx from "clsx";
import { MoveDown, MoveUp, Upload, UserPlus } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { DateFmt } from "~/core/utils/DateFmt";
import { UserSortField, UserSortOrder } from "~/domain/users/models/AdminQueryUsersModels";
import { AdminUserListItem } from "~/domain/users/models/AdminUserListItem";
import { AdminUsersService } from "~/domain/users/services/AdminUsersService";
import { Card, CardBody, CardFooter, CardHeader } from "~/ui/components/card";
import { UserAvatar } from "~/ui/portal/components/avatar/UserAvatar";
import { Badge } from "~/ui/widgets/badges/Badge";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { Input } from "~/ui/widgets/form/Input";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { AdminPageAppBar, AdminPageAppBarTitle } from "../../components/PageAppBar";
import { UsersPageContext, useUsersPageStore } from "./UsersPageContext";
import { UsersPageStore } from "./UsersPageStore";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<UsersPageStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new UsersPageStore({ usersService: new AdminUsersService() });
    }
    return <UsersPageContext.Provider value={storeRef.current}>{children}</UsersPageContext.Provider>;
}

export default function UsersPage() {
    return (
        <PageProvider>
            <UsersPageInner />
        </PageProvider>
    );
}

function UsersPageInner() {
    const store = useUsersPageStore();

    useEffect(() => {
        store.loadUsers({ page: 1 });
    }, [store]);

    return (
        <div className="w-full">
            <AdminPageAppBar start={<AdminPageAppBarTitle title="Manage Users" />} />
            <div className="p-6">
                <Card>
                    <CardHeader divider className="px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                            <SearchBar />
                            <div className="flex flex-row gap-2">
                                <Button variant="outline" color="secondary" icon={<Upload className="w-4 h-4" />}>Import Users</Button>
                                <Button variant="solid" color="primary" icon={<UserPlus className="w-4 h-4" />}>Add User</Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardBody className="p-0">
                        <Observer>
                            {() =>
                                store.loadState.stateWhen({
                                    initOrLoading: () => <CenteredLoader />,
                                    error: () => <TableErrorView />,
                                    loaded: () => <UsersTable />,
                                })
                            }
                        </Observer>
                    </CardBody>

                    <Observer>
                        {() =>
                            store.loadState.stateWhen({
                                loaded: () => {
                                    const pageInfo = store.loadState.data!.pageInfo;
                                    return (
                                        <CardFooter divider className="px-3 py-2">
                                            <div className="flex justify-end">
                                                <Pagination
                                                    currentPage={pageInfo.page}
                                                    totalPages={pageInfo.totalPages}
                                                    onNext={() => store.onPageChanged(pageInfo.page + 1)}
                                                    onPrev={() => store.onPageChanged(pageInfo.page - 1)}
                                                    onFirst={() => store.onPageChanged(1)}
                                                    onLast={() => store.onPageChanged(pageInfo.totalPages)}
                                                />
                                            </div>
                                        </CardFooter>
                                    );
                                },
                                initOrLoading: () => null,
                                error: () => null,
                            })
                        }
                    </Observer>
                </Card>
            </div>
        </div>
    );
}

function SearchBar() {
    const store = useUsersPageStore();
    return (
        <div className="w-full max-w-md">
            <Input
                inputSize="md"
                placeholder="Search users by name, email, or mobile"
                type="search"
                className="font-medium"
                onChange={(e) => store.setSearchText(e.target.value)}
            />
        </div>
    );
}

function UsersTable() {
    const store = useUsersPageStore();
    const items = store.loadState.data!.items as AdminUserListItem[];

    return (
        <div className="overflow-x-auto datatable-scrollbar">
            <table className="min-w-full text-[13px]">
                <thead className="bg-content2">
                    <tr>
                        <Th compact sortable field={UserSortField.NAME} label="User" />
                        <Th compact sortable field={UserSortField.EMAIL} label="Email" />
                        <Th compact sortable field={UserSortField.MOBILE} label="Mobile" />
                        <Th compact sortable field={UserSortField.ROLE_NAME} label="Role" />
                        <Th compact sortable field={UserSortField.CREATED_AT} label="Created" className="min-w-[140px]" />
                    </tr>
                </thead>
                <tbody>
                    {items.length ? (
                        items.map((item) => <UserRow key={item.base.id} item={item} />)
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center text-default py-5 px-3">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Th({
    field,
    label,
    sortable = false,
    className,
    compact = false,
}: {
    field?: UserSortField;
    label?: string;
    sortable?: boolean;
    className?: string;
    compact?: boolean;
}) {
    const store = useUsersPageStore();
    const isActive = field && store.sortField === field;
    const isAsc = isActive && store.sortOrder === UserSortOrder.ASC;

    return (
        <th
            onClick={sortable && field ? () => store.onSortChanged(field) : undefined}
            className={clsx(
                "font-semibold text-secondary uppercase whitespace-nowrap text-left align-middle",
                compact ? "px-3 py-1.5 text-[11px]" : "px-4 py-2 text-sm",
                sortable && "cursor-pointer",
                className
            )}
        >
            <div className="flex items-center gap-1 select-none">
                <span>{label}</span>
                {sortable && (
                    <span className={clsx("inline-flex items-center", isActive ? "text-default" : "text-secondary")}>
                        {isActive ? (isAsc ? <MoveUp size={12} /> : <MoveDown size={12} />) : <span className="w-[12px] h-[12px]" />}
                    </span>
                )}
            </div>
        </th>
    );
}

function UserRow({ item }: { item: AdminUserListItem }) {
    return (
        <tr className="border-t border-default/60 hover:bg-content2 transition-colors cursor-pointer">
            <Td className="max-w-[340px]">
                <div className="flex items-center gap-2.5">
                    <UserAvatar id={item.base.id} name={item.base.name} sizeClass="w-8 h-8" />
                    <div className="min-w-0 leading-tight">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-default truncate">{item.base.name}</span>
                        </div>
                        <div className="text-[11px] text-secondary truncate">{item.base.userName ?? ""}</div>
                    </div>
                </div>
            </Td>
            <Td>{item.base.email}</Td>
            <Td>{item.base.mobile ?? "-"}</Td>
            <Td>
                <Badge variant="soft" color={"secondary"} size="xs">
                    {item.role.name}
                </Badge>
            </Td>
            <Td>{DateFmt.datetime(item.createdAt)}</Td>
        </tr>
    );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={clsx("px-3 py-1.5 whitespace-nowrap align-middle text-default", className)}>{children}</td>;
}

function ShimmerRow() {
    return (
        <tr className="border-t border-default/60">
            <Td className="max-w-[340px]">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                    <div className="min-w-0 leading-tight">
                        <div className="w-24 h-4 bg-gray-300 animate-pulse mb-1"></div>
                        <div className="w-16 h-3 bg-gray-300 animate-pulse"></div>
                    </div>
                </div>
            </Td>
            <Td><div className="w-32 h-4 bg-gray-300 animate-pulse"></div></Td>
            <Td><div className="w-20 h-4 bg-gray-300 animate-pulse"></div></Td>
            <Td><div className="w-16 h-4 bg-gray-300 animate-pulse"></div></Td>
            <Td><div className="w-24 h-4 bg-gray-300 animate-pulse"></div></Td>
        </tr>
    );
}

function TableErrorView() {
    const store = useUsersPageStore();
    return (
        <SimpleRetryableAppView
            className="p-4 border-t border-default"
            appError={store.loadState.error!}
            onRetry={() => store.loadUsers({ page: 1 })}
        />
    );
}

function CenteredLoader() {
    return (
        <div className="overflow-x-auto datatable-scrollbar">
            <table className="min-w-full text-[13px]">
                <thead className="bg-content2">
                    <tr>
                        <Th compact sortable field={UserSortField.NAME} label="User" />
                        <Th compact sortable field={UserSortField.EMAIL} label="Email" />
                        <Th compact sortable field={UserSortField.MOBILE} label="Mobile" />
                        <Th compact sortable field={UserSortField.ROLE_NAME} label="Role" />
                        <Th compact sortable field={UserSortField.CREATED_AT} label="Created" className="min-w-[140px]" />
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, i) => <ShimmerRow key={i} />)}
                </tbody>
            </table>
        </div>
    );
}
