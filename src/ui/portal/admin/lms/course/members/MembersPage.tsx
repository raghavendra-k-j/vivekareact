import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { LMSConst } from "~/domain/lms/models/LMSConst";
import { SpaceMemberRole } from "~/domain/lms/models/SpaceMemberRole";
import { Card, CardBody, CardFooter, CardHeader } from "~/ui/components/card";
import { Button } from "~/ui/widgets/button/Button";
import { Input } from "~/ui/widgets/form/Input";
import { ListBox } from "~/ui/widgets/form/ListBox";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { useCourseLayoutStore } from "../layout/CourseLayoutContext";
import { MembersContext, useMembersStore } from "./MembersContext";
import { MembersStore } from "./MembersStore";
import { MembersTable } from "./components/TableView";

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
                <Observer>
                    {() => {
                        if (store.queryState.isData) {
                            return <MembersTable />;
                        }
                        return null;
                    }}
                </Observer>
            </CardBody>
            <Observer>{() => {
                if (store.selectedItems.size > 0) {
                    return (<CardFooter className="px-3 py-2 flex items-center justify-between">
                        <div className="text-sm text-secondary">{store.selectedItems.size} items selected</div>
                        <Button
                            color="danger"
                            size="sm"
                            onClick={() => store.removeSelectedItems()}
                        >
                            Remove Selected
                        </Button>
                    </CardFooter>);
                }
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
