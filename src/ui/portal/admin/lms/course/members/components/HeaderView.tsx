import { Observer } from "mobx-react-lite";
import { SpaceMemberRole } from "~/domain/lms/models/SpaceMemberRole";
import { Button } from "~/ui/widgets/button/Button";
import { Input } from "~/ui/widgets/form/Input";
import { PopoverSelect } from "~/ui/widgets/form/PopoverSelect";
import { useMembersStore } from "../MembersContext";

export function HeaderView() {
    const store = useMembersStore();
    return (
        <Observer>
            {() => {
                return (
                    <div className="flex items-center justify-between gap-3 p-4 border-b border-default">
                        <div className="flex items-center gap-3 flex-1">
                            <Observer>
                                {() => (
                                    <Input
                                        inputSize="md"
                                        placeholder="Search members by name or email..."
                                        type="search"
                                        className="font-medium w-full max-w-md"
                                        value={store.searchQuery}
                                        onChange={(e) => {
                                            store.setSearchQuery(e.target.value);
                                        }}
                                    />
                                )}
                            </Observer>
                            <Observer>
                                {() => (
                                    <PopoverSelect<SpaceMemberRole>
                                        items={[SpaceMemberRole.ADMIN, SpaceMemberRole.USER]}
                                        value={store.selectedRole}
                                        onValueChange={(role) => {
                                            store.setSelectedRole(role);
                                        }}
                                        itemRenderer={(item: SpaceMemberRole) => item.label}
                                        itemKey={(item: SpaceMemberRole) => item.role}
                                        placeholder="All Roles"
                                        allowEmpty={true}
                                        className="w-36 shrink-0"
                                    />
                                )}
                            </Observer>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Observer>
                                {() => (
                                    <Button
                                        color="primary"
                                        variant="solid"
                                        size="md"
                                        onClick={() => store.showAddMembersDialog()}
                                        disabled={store.selectedItems.size > 0}
                                    >
                                        Add Members
                                    </Button>
                                )}
                            </Observer>
                            <Observer>
                                {() => (
                                    <Button
                                        color="danger"
                                        variant="solid"
                                        size="md"
                                        onClick={() => store.removeSelectedItems()}
                                        disabled={store.selectedItems.size === 0}
                                    >
                                        Remove Selected ({store.selectedItems.size})
                                    </Button>
                                )}
                            </Observer>
                        </div>
                    </div>
                );
            }}
        </Observer>
    );
}