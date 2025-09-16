import { User, UserPlus } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { DateFmt } from "~/core/utils/DateFmt";
import { AdminCMItem } from "~/domain/lms/models/AdminCMItem";
import { Card, CardBody, CardHeader } from "~/ui/components/card";
import { Badge } from "~/ui/widgets/badges/Badge";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { Input } from "~/ui/widgets/form/Input";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { useCoursePageStore } from "../CoursePageContext";
import { MembersContext, useMembersStore } from "./MembersContext";
import { MembersStore } from "./MembersStore";

function MembersProvider({ children }: { children: React.ReactNode }) {
    const store = useRef<MembersStore | null>(null);
    const layoutStore = useCoursePageStore();
    if (store.current === null) {
        store.current = new MembersStore({
            layoutStore: layoutStore
        });
    }
    return <MembersContext.Provider value={store.current}>{children}</MembersContext.Provider>;
}

export default function MembersPage() {
    return (
        <MembersProvider>
            <MembersPageInner />
        </MembersProvider>
    );
}

function MembersPageInner() {
    const store = useMembersStore();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            const courseId = parseInt(id, 10);
            store.setCourseId(courseId);
            store.loadMembers({ page: 1 });
        }
    }, [store, id]);

    return (
        <div className="w-full">
            <div className="p-6">
                <Card>
                    <CardHeader divider className="px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                            <SearchAndFilterBar />
                            <div className="flex flex-row gap-2">
                                <Button
                                    color="primary"
                                    variant="solid"
                                    size="md"
                                    onClick={() => console.log('Add Members clicked')}
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Add Members
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardBody className="p-0">
                        <Observer>
                            {() =>
                                store.queryState.stateWhen({
                                    initOrLoading: () => (
                                        <div className="flex justify-center items-center p-8">
                                            <LoaderView />
                                        </div>
                                    ),
                                    error: () => <TableErrorView />,
                                    loaded: () => <MembersTable />,
                                })
                            }
                        </Observer>
                    </CardBody>

                    <Observer>
                        {() =>
                            store.queryState.stateWhen({
                                loaded: () => {
                                    const pageInfo = store.listVm.pageInfo;
                                    return (
                                        <div className="px-3 py-2 border-t border-default">
                                            <Pagination
                                                currentPage={store.currentPage}
                                                totalPages={pageInfo.totalPages}
                                                onNext={() => store.goToPage(store.currentPage + 1)}
                                                onPrev={() => store.goToPage(store.currentPage - 1)}
                                                onFirst={() => store.goToPage(1)}
                                                onLast={() => store.goToPage(pageInfo.totalPages)}
                                            />
                                        </div>
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

function SearchAndFilterBar() {
    const store = useMembersStore();

    return (
        <div className="flex items-center gap-3">
            <div className="w-full max-w-md">
                <Input
                    inputSize="md"
                    placeholder="Search members by name or email..."
                    type="search"
                    className="font-medium"
                    value={store.searchQuery}
                    onChange={(e) => store.setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
}

function MembersTable() {
    const store = useMembersStore();
    const items = store.listVm.items;

    return (
        <div className="overflow-x-auto datatable-scrollbar">
            <table className="min-w-full text-[13px]">
                <thead className="bg-content2">
                    <tr>
                        <Th label="Member" />
                        <Th label="Email" />
                        <Th label="Role" />
                        <Th label="Joined" className="min-w-[140px]" />
                        <Th label="Actions" className="min-w-[100px]" />
                    </tr>
                </thead>
                <tbody>
                    {items.length ? (
                        items.map((item) => <MemberRow key={item.id} item={item} />)
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-3 py-8 text-center text-secondary">
                                No members found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Th({ label, className = "" }: { label: string; className?: string }) {
    return (
        <th className={`font-semibold text-secondary uppercase whitespace-nowrap text-left align-middle px-3 py-1.5 text-[11px] ${className}`}>
            {label}
        </th>
    );
}

function MemberRow({ item }: { item: AdminCMItem }) {
    return (
        <tr className="border-t border-default/60 hover:bg-content2 transition-colors cursor-pointer">
            <Td className="max-w-[300px]">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg ring-1 ring-blue-200/50">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 leading-tight">
                        <div className="text-sm font-medium text-default truncate">{item.name}</div>
                    </div>
                </div>
            </Td>
            <Td className="max-w-[250px]">
                <div className="text-sm text-default truncate">{item.email}</div>
            </Td>
            <Td>
                <Badge
                    variant="soft"
                    color={item.role.isAdmin ? "primary" : "secondary"}
                    size="xs"
                >
                    {item.role.label}
                </Badge>
            </Td>
            <Td>{DateFmt.datetime(item.joinedAt)}</Td>
            <Td>
                <div className="flex items-center gap-1">
                    <Button
                        color="secondary"
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Edit member', item.id)}
                    >
                        Edit
                    </Button>
                </div>
            </Td>
        </tr>
    );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-3 py-1.5 whitespace-nowrap align-middle text-default ${className}`}>{children}</td>;
}

function TableErrorView() {
    const store = useMembersStore();
    return (
        <SimpleRetryableAppView
            className="p-4 border-t border-default"
            appError={store.queryState.error!}
            onRetry={() => store.loadMembers({ page: store.currentPage })}
        />
    );
}