import { User } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { DateFmt } from "~/core/utils/DateFmt";
import { AdminCMItem } from "~/domain/lms/models/AdminCMItem";
import { LMSConst } from "~/domain/lms/models/LMSConst";
import { SpaceMemberRole } from "~/domain/lms/models/SpaceMemberRole";
import { Card, CardBody, CardFooter, CardHeader } from "~/ui/components/card";
import { Badge } from "~/ui/widgets/badges/Badge";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { Input } from "~/ui/widgets/form/Input";
import { ListBox } from "~/ui/widgets/form/ListBox";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { useCourseLayoutStore } from "../layout/CourseLayoutContext";
import { MembersContext, useMembersStore } from "./MembersContext";
import { MembersStore } from "./MembersStore";

function MembersProvider({ children }: { children: React.ReactNode }) {
    const store = useRef<MembersStore | null>(null);
    const layoutStore = useCourseLayoutStore();
    if (store.current === null) {
        store.current = new MembersStore({
            layoutStore: layoutStore
        });
    }
    return (<MembersContext.Provider
        value={store.current}>
        {children}
    </MembersContext.Provider>);
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

    useEffect(() => {
        store.loadMembers({ page: 1 });
    }, [store]);

    return (
        <Card className="m-6">
            <MembersHeader />
            <CardBody>
                <MembersTable />
            </CardBody>
            <Observer>{() => {
                if (!store.queryState.isData) {
                    return null;
                }
                return (<CardFooter className="px-3 py-2">
                    <Pagination
                        currentPage={store.listVm.pageInfo.page}
                        totalPages={store.listVm.pageInfo.totalPages}
                        onNext={() => store.goToPage(store.listVm.pageInfo.page + 1)}
                        onPrev={() => store.goToPage(store.listVm.pageInfo.page - 1)}
                        onFirst={() => store.goToPage(1)}
                        onLast={() => store.goToPage(store.listVm.pageInfo.totalPages)}
                    />
                </CardFooter>);
            }}</Observer>
        </Card>
    );
}

function SearchAndFilterBar() {
    const store = useMembersStore();
    return (
        <div className="flex flex-1 items-center gap-3">
            <Observer>
                {() => (<Input
                    inputSize="md"
                    placeholder="Search members by name, email or mobile number"
                    type="search"
                    className="font-medium w-full "
                    value={store.searchQuery}
                    onChange={(e) => store.setSearchQuery(e.target.value)}
                />)}
            </Observer>
            <Observer>
                {() => (
                    <ListBox<SpaceMemberRole>
                        className="min-w-36 shrink-0"
                        items={[SpaceMemberRole.ADMIN, SpaceMemberRole.USER]}
                        itemKey={item => item.role}
                        itemRenderer={item => {
                            if (item === SpaceMemberRole.ADMIN) {
                                return store.layoutStore.entity(LMSConst.ENTITY_ADMIN).nameSingular;
                            }
                            else if (item === SpaceMemberRole.USER) {
                                return store.layoutStore.entity(LMSConst.ENTITY_USER).nameSingular;
                            }
                            else {
                                return item.label;
                            }
                        }}
                        inputSize="md"
                        placeholder="Select Role"
                        onValueChange={(role) => store.setSelectedRole(role)}
                        value={store.selectedRole}
                    />
                )}
            </Observer>
        </div>
    );
}

function MembersHeader() {
    const store = useMembersStore();
    return (
        <CardHeader className="px-3 py-2">
            <div className="flex items-center justify-between gap-3">
                <SearchAndFilterBar />
                <Button
                    size="md"
                    onClick={() => store.showAddMembersDialog()}
                >
                    Add Members
                </Button>
            </div>
        </CardHeader>
    );
}







function MembersTable() {
    const store = useMembersStore();
    return (
        <div className="overflow-x-auto datatable-scrollbar datatable datatable-bordered-h">
            <table className="min-w-full w-full text-[13px]">
                <thead className="datatable-head">
                    <tr>
                        <Th label="Member" />
                        <Th label="Email" />
                        <Th label="Role" />
                        <Th label="Joined" />
                        <Th label="Actions" />
                    </tr>
                </thead>
                <tbody>
                    <Observer>
                        {() => {
                            if (store.queryState.isData) {
                                return <MemberRows />;
                            } else {
                                return <MembersStatusView />;
                            }
                        }}
                    </Observer>
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

function MemberRows() {
    const store = useMembersStore();
    const items = store.listVm.items;
    return items.length ? (
        <>
            {items.map((item) => <MemberRow key={item.id} item={item} />)}
        </>
    ) : (
        <tr>
            <td colSpan={5} className="px-3 py-8 text-center text-secondary">
                No members found
            </td>
        </tr>
    );
}

function MembersStatusView() {
    const store = useMembersStore();
    return (
        <tr>
            <td colSpan={5} className="px-3 py-8">
                <div className="flex justify-center items-center">
                    {store.queryState.isError ? (
                        <SimpleRetryableAppView
                            appError={store.queryState.error!}
                            onRetry={() => store.loadMembers({ page: store.currentPage })}
                        />
                    ) : (
                        <LoaderView />
                    )}
                </div>
            </td>
        </tr>

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