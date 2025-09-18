import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { UserRoleType } from "~/domain/common/models/UserRoleType";
import { QueryAddMemberItem } from "~/domain/lms/models/QueryAddMembersModels";
import { FullCenteredView } from "~/ui/components/common/FullCenteredView";
import { DialogCloseButton, DialogCustomFooter, DialogHeader, SelectAllCheckbox } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { UserAvatar } from "~/ui/portal/components/avatar/UserAvatar";
import { Button } from "~/ui/widgets/button/Button";
import { Dialog, DialogContent, DialogOverlay, DialogScaffold } from "~/ui/widgets/dialogmanager";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { CheckMark } from "~/ui/widgets/form/CheckMark";
import { Input } from "~/ui/widgets/form/Input";
import { ListBox } from "~/ui/widgets/form/ListBox";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { MembersStore } from "../members/MembersStore";
import { AddMembersDialogProvider, useAddMembersDialogStore } from "./AddMembersDialogContext";
import { AddMembersDialogStore } from "./AddMembersDialogStore";

export type AddMembersDialogProps = {
    membersStore: MembersStore;
}

function DialogHeaderView() {
    const store = useAddMembersDialogStore();
    return (<div className="border-b border-default">
        <DialogHeader title="Add Members" onClose={<DialogCloseButton onClick={() => store.closeDialog()} />} />
        <div className="flex flex-row gap-3 px-3 py-2">
            <Observer>
                {() => (<Input
                    type="search"
                    value={store.searchText}
                    onChange={(e) => store.setSearchText(e.target.value)}
                    placeholder="Search users by name, email or mobile number"
                />)}
            </Observer>
            <Observer>
                {() => (<ListBox<UserRoleType>
                    items={[UserRoleType.admin, UserRoleType.user]}
                    placeholder="All Role Types"
                    itemRenderer={(role) => role.label}
                    itemKey={(item) => item.value}
                    value={store.selectedRoleType}
                    onValueChange={(role) => store.setSelectedRoleType(role)}
                    className="shrink-0 min-w-[150px]"
                />)}
            </Observer>
        </div>
    </div>);
}


function DialogFooterView() {
    const store = useAddMembersDialogStore();
    return (<DialogCustomFooter className="border-t border-default"
        justify="justify-between"
        start={<Observer>{() => {
            return (<SelectAllCheckbox
                value={store.hasSelectedUsers && store.selectedUsersCount === store.listVm.items.length}
                onChange={(checked) => store.toggleSelectAll(checked)}
            />);
        }}</Observer>}
        end={<div className="flex gap-2">
            <Button
                variant="outline"
                color="secondary"
                onClick={() => store.closeDialog()}
            >
                Cancel
            </Button>
            <Observer>
                {() => (
                    <Button
                        disabled={!store.canEnableAddButton}
                        variant="solid"
                        color="primary"
                        onClick={() => store.addMembers()}
                    >
                        {store.addState.isLoading ? "Adding..." : `Add Members${store.selectedUsersCount > 0 ? ` (${store.selectedUsersCount})` : ''}`}
                    </Button>
                )}
            </Observer>
        </div>}
    />);
}



function UserItem({ user, store }: { user: QueryAddMemberItem, store: AddMembersDialogStore }) {
    return (<div className="px-3 py-2 flex flex-row items-center gap-3 cursor-pointer hover:bg-hover select-none" onClick={() => store.toggleUserSelection(user.userBase.id)}>
        <div className="flex flex-row items-center gap-3 flex-1">
            <UserAvatar id={user.userBase.id} name={user.userBase.name} />
            <div className="flex-1">
                <div className="font-medium text-sm">{user.userBase.name}</div>
                <div className="text-xs text-secondary">{user.userBase.email}</div>
            </div>
        </div>
        <Observer>
            {() => (<CheckMark
                width="w-5" height="h-5"
                onChange={() => store.toggleUserSelection(user.userBase.id)}
                value={store.selectedIds.has(user.userBase.id)}
            />)}
        </Observer>
    </div>);
}


function UserList() {
    const store = useAddMembersDialogStore();
    const pageInfo = store.listVm.pageInfo;

    if (store.listVm.items.length === 0) {
        return (<FullCenteredView>
            No results found
        </FullCenteredView>);
    }
    return (
        <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto divide-y divide-default">
                {store.listVm.items.map((user) => (
                    <UserItem
                        key={user.userBase.id}
                        user={user}
                        store={store}
                    />))}
            </div>
            {store.listVm.pageInfo.totalPages > 1 && (<div className="border-t border-default px-3 py-2 flex justify-center flex-shrink-0">
                <Pagination
                    currentPage={pageInfo.page}
                    totalPages={pageInfo.totalPages}
                    onNext={() => store.loadUsers({ page: pageInfo.page + 1 })}
                    onPrev={() => store.loadUsers({ page: pageInfo.page - 1 })}
                    onFirst={() => store.loadUsers({ page: 1 })}
                    onLast={() => store.loadUsers({ page: pageInfo.totalPages })}
                />
            </div>)}
        </div>
    );
}

function MainContent() {
    const store = useAddMembersDialogStore();
    return (
        <Observer>
            {() => {
                if (store.loadUsersState.isData) {
                    return (<UserList />);
                }
                else if (store.loadUsersState.isError) {
                    return (<FullCenteredView className="overflow-y-auto">
                        <SimpleRetryableAppView
                            appError={store.loadUsersState.error}
                            onRetry={() => store.loadUsers()}
                        />
                    </FullCenteredView>);
                }
                else {
                    return (<FullCenteredView>
                        <LoaderView />
                    </FullCenteredView>);
                }
            }}
        </Observer>
    );
}


function DialogInner() {
    const store = useAddMembersDialogStore();

    useEffect(() => {
        if (store.loadUsersState.isInit) {
            store.loadUsers();
        }
    }, [store]);

    return (
        <Dialog onClose={() => { }}>
            <DialogOverlay />
            <DialogScaffold className="p-4">
                <DialogContent className="w-full max-w-xl h-full max-h-[640px] flex flex-col overflow-y-hidden">
                    <DialogHeaderView />
                    <MainContent />
                    <DialogFooterView />
                </DialogContent>
            </DialogScaffold>
        </Dialog>
    );
}

export default function AddMembersDialog(props: AddMembersDialogProps) {
    const storeRef = useRef<AddMembersDialogStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new AddMembersDialogStore({
            membersPageStore: props.membersStore,
        });
    }
    return (
        <AddMembersDialogProvider store={storeRef.current}>
            <DialogInner />
        </AddMembersDialogProvider>
    );
}