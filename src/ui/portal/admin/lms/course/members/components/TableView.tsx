import { Observer } from "mobx-react-lite";
import { DateFmt } from "~/core/utils/DateFmt";
import { AdminCMItem } from "~/domain/lms/models/AdminCMItem";
import { UserAvatar } from "~/ui/portal/components/avatar/UserAvatar";
import { Badge } from "~/ui/widgets/badges/Badge";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { CheckMark } from "~/ui/widgets/form/CheckMark";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { useMembersStore } from "../MembersContext";

export function MembersTable() {
    const store = useMembersStore();
    return (
        <div className="overflow-x-auto datatable-scrollbar datatable datatable-bordered-h">
            <table className="min-w-full w-full text-[13px]">
                <thead className="datatable-head">
                    <tr>
                        <Th className="w-12">
                            <Observer>
                                {() => (<CheckMark
                                    value={store.listVm.items.length > 0 && store.selectedItems.size === store.listVm.items.length}
                                    onChange={() => store.toggleSelectAll()}
                                />)}
                            </Observer>
                        </Th>
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

function Th({ label, className = "", children }: { label?: string; className?: string, children?: React.ReactNode }) {
    return (
        <th className={`font-semibold text-secondary uppercase whitespace-nowrap text-left align-middle px-3 py-1.5 text-[11px] ${className}`}>
            {label ?? children}
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
            <td colSpan={6} className="px-3 py-8 text-center text-secondary">
                No members found
            </td>
        </tr>
    );
}

function MembersStatusView() {
    const store = useMembersStore();
    return (
        <tr>
            <td colSpan={6} className="px-3 py-8">
                <div className="flex justify-center items-center">
                    {store.queryState.isError ? (
                        <SimpleRetryableAppView
                            appError={store.queryState.error!}
                            onRetry={() => store.loadMembers({ page: store.queryState.isData ? store.listVm.pageInfo.page : 1 })}
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
    const store = useMembersStore();
    return (
        <tr className="border-t border-default/60 hover:bg-content2 transition-colors cursor-pointer">
            <Td>
                <Observer>
                    {() => (<CheckMark
                        value={store.selectedItems.has(item.id)}
                        onChange={() => store.toggleSelectItem(item.id)}
                    />)}
                </Observer>
            </Td>
            <Td className="max-w-[300px]">
                <div className="flex items-center gap-2.5">
                    <UserAvatar id={item.id} name={item.name} />
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
