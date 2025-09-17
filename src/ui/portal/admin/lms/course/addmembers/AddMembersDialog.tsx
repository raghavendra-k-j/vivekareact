import { useRef } from "react";
import React from "react";
import { Dialog, DialogContent, DialogOverlay, DialogScaffold } from "~/ui/widgets/dialogmanager";
import { AddMembersDialogProvider, useAddMembersDialogStore } from "./AddMembersDialogContext";
import { AddMembersDialogStore } from "./AddMembersDialogStore";
import { MembersStore } from "../members/MembersStore";
import { DialogCloseButton, DialogFooter, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { Button } from "~/ui/widgets/button/Button";
import { Observer } from "mobx-react-lite";
import { SearchInput } from "~/ui/widgets/search/SearchInput";
import { FSelectField, FSelectOption } from "~/ui/widgets/form/SelectField";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { UserRoleType } from "~/domain/common/models/UserRoleType";
import { QueryAddMemberItem } from "~/domain/lms/models/QueryAddMembersModels";

export type AddMembersDialogProps = {
    membersStore: MembersStore;
}


function DialogHeaderView() {
    const store = useAddMembersDialogStore();

    const roleOptions: FSelectOption<UserRoleType>[] = UserRoleType.values.map(role => ({
        data: role,
        value: (data) => data.value,
        label: (data) => data.label,
    }));

    const selectedRoleValue = new InputValue<string>(
        store.selectedRoleType?.value || ""
    );

    // Update store when role selection changes
    React.useEffect(() => {
        const roleType = selectedRoleValue.value ? UserRoleType.fromValueStr(selectedRoleValue.value) : null;
        if (roleType?.value !== store.selectedRoleType?.value) {
            store.setSelectedRoleType(roleType);
        }
    }, [selectedRoleValue.value, store]);

    return (
        <Observer>
            {() => (
                <div className="space-y-4">
                    <DialogHeader title="Add Members" onClose={<DialogCloseButton onClick={() => store.closeDialog()} />} />

                    <div className="flex gap-3 items-end">
                        <div className="flex-1">
                            <SearchInput
                                placeholder="Search users..."
                                value={store.searchText}
                                onChange={(e) => store.setSearchText(e.target.value)}
                                inputSize="md"
                                disabled={store.isLoadingUsers}
                            />
                        </div>

                        <div className="w-48">
                            <FSelectField
                                label="Role"
                                field={selectedRoleValue}
                                options={roleOptions}
                                placeholder="All roles"
                                inputSize="md"
                            />
                        </div>

                        {(store.searchText || store.selectedRoleType) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => store.resetSearch()}
                                disabled={store.isLoadingUsers}
                            >
                                Clear
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </Observer>
    );
}

function UserListItem({ user }: { user: QueryAddMemberItem }) {
    const store = useAddMembersDialogStore();

    return (
        <Observer>
            {() => {
                const isSelected = store.selectedIds.has(user.userBase.id);
                return (
                    <div className="flex items-center gap-3 p-3 border border-default rounded-md hover:bg-surface-secondary/50 transition-colors">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => store.toggleUserSelection(user.userBase.id)}
                            className="w-4 h-4 text-primary border-default rounded focus:ring-primary"
                            disabled={store.isLoadingUsers}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-default truncate">{user.userBase.name}</span>
                                <span className="text-sm text-secondary">({user.userBase.email})</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-surface-secondary px-2 py-1 rounded">
                                    {user.roleType.label}
                                </span>
                                {user.joinedAt && (
                                    <span className="text-xs text-secondary">
                                        Joined: {user.joinedAt.toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }}
        </Observer>
    );
}

function UserList() {
    const store = useAddMembersDialogStore();

    return (
        <Observer>
            {() => store.loadUsersState.stateWhen({
                initOrLoading: () => (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                        <div className="text-secondary">Loading users...</div>
                    </div>
                ),
                loaded: (vm) => (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {vm.members.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-secondary mb-2">No users found</div>
                                <div className="text-xs text-secondary">
                                    {store.searchText || store.selectedRoleType
                                        ? "Try adjusting your search or filter criteria"
                                        : "No users available to add"
                                    }
                                </div>
                            </div>
                        ) : (
                            <>
                                {vm.members.map(user => (
                                    <UserListItem key={user.userBase.id} user={user} />
                                ))}
                                {store.hasMorePages && (
                                    <div className="text-center pt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => store.loadNextPage()}
                                            disabled={store.isLoadingUsers}
                                        >
                                            {store.isLoadingUsers ? "Loading..." : "Load More"}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ),
                error: (error) => (
                    <div className="text-center py-12">
                        <div className="text-error mb-2">Error loading users</div>
                        <div className="text-xs text-secondary mb-4">{error.message}</div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => store.loadUsers()}
                            disabled={store.isLoadingUsers}
                        >
                            Try Again
                        </Button>
                    </div>
                ),
            })}
        </Observer>
    );
}

function MainContent() {
    return (
        <div className="space-y-4">
            <UserList />
        </div>
    );
}


function DialogInner() {
    const store = useAddMembersDialogStore();

    React.useEffect(() => {
        if (store.loadUsersState.isInit) {
            store.loadUsers();
        }
    }, [store]);

    return (
        <Dialog onClose={() => { }}>
            <DialogOverlay />
            <DialogScaffold className="p-4">
                <DialogContent className="w-full max-w-xl">
                    <DialogHeaderView />
                    <MainContent />
                    <DialogFooter
                        className="border-t border-default"
                        actions={[
                            <Button
                                variant="outline"
                                color="secondary"
                                onClick={() => store.closeDialog()}
                            >
                                Cancel
                            </Button>,
                            <Observer>
                                {() => (
                                    <Button
                                        disabled={!store.canAddMembers}
                                        variant="solid"
                                        color="primary"
                                        onClick={() => store.addMembers()}
                                    >
                                        {store.addState.isLoading ? "Adding..." : `Add ${store.selectedUsersCount > 0 ? `${store.selectedUsersCount} ` : ''}Members`}
                                    </Button>
                                )}
                            </Observer>
                        ]}
                    />
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