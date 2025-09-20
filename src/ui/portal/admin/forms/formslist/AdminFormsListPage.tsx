import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { DateFmt } from "~/core/utils/DateFmt";
import { AdminFormListTile } from "~/domain/forms/admin/models/AdminQueryFormsModels";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { FormType } from "~/domain/forms/models/FormType";
import { Card, CardBody } from "~/ui/components/card";
import { FormAvatar } from "~/ui/components/form/commons/FormAvatar";
import { Badge } from "~/ui/widgets/badges/Badge";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { Input } from "~/ui/widgets/form/Input";
import { ListBox } from "~/ui/widgets/form/ListBox";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { AdminPageAppBar, AdminPageAppBarTitle } from "../../components/PageAppBar";
import { useAdminFormsModuleStore } from "../layout/FormsLayoutContext";
import { AdminFormsListContext, useAdminFormsListStore } from "./AdminFormsListContext";
import { AdminFormsListStore } from "./AdminFormsListStore";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AdminFormsListStore | null>(null);
    const layoutStore = useAdminFormsModuleStore();
    if (!storeRef.current) {
        storeRef.current = new AdminFormsListStore({
            layoutStore: layoutStore,
        });
    }
    return (
        <AdminFormsListContext.Provider value={storeRef.current}>
            {children}
        </AdminFormsListContext.Provider>
    );
}

export default function AdminFormsListPage() {
    return (
        <PageProvider>
            <AdminFormsListPageInner />
        </PageProvider>
    );
}

function AdminFormsListPageInner() {
    const store = useAdminFormsListStore();

    useEffect(() => {
        store.loadForms({ page: 1 });
    }, [store]);

    return (
        <div className="w-full h-full flex flex-col">
            <AdminPageAppBar
                className="border-b border-default"
                start={<AdminPageAppBarTitle title="Assessments and Surveys" />}
                end={
                    <div className="flex flex-row gap-2">
                        <Button
                            color="success"
                            variant="solid"
                            size="md"
                            onClick={() => store.newForm({ type: FormType.Assessment })}
                        >
                            New Assessment
                        </Button>
                        <Button
                            color="primary"
                            variant="solid"
                            size="md"
                            onClick={() => store.newForm({ type: FormType.Survey })}
                        >
                            New Survey
                        </Button>
                    </div>
                }
                bottom={<SearchAndFilterBar />}
            />
            <div className="flex-1 overflow-hidden">
                <div className="h-full p-6">
                    <Card className="h-full flex flex-col">
                        <CardBody className="flex-1 overflow-hidden p-0">
                            <Observer>
                                {() =>
                                    store.queryState.stateWhen({
                                        initOrLoading: () => (
                                            <div className="flex justify-center items-center p-8">
                                                <LoaderView />
                                            </div>
                                        ),
                                        error: () => <TableErrorView />,
                                        loaded: () => <FormsTable />,
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
                                            <div className="px-3 py-2 border-t border-default flex justify-end">
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
        </div>
    );
}

function SearchAndFilterBar() {
    const store = useAdminFormsListStore();
    return (
        <div className="flex flex-1 items-center gap-3 px-6 py-3 border-t border-default">
            <Observer>
                {() => (
                    <Input
                        inputSize="md"
                        placeholder="Search forms by title..."
                        type="search"
                        className="font-medium w-full max-w-md"
                        value={store.searchQuery}
                        onChange={(e) => store.setSearchQuery(e.target.value)}
                    />
                )}
            </Observer>
            <Observer>
                {() => (
                    <ListBox<FormType>
                        className="min-w-36 shrink-0"
                        items={[FormType.Assessment, FormType.Survey]}
                        itemKey={item => item.type}
                        itemRenderer={item => item.name}
                        inputSize="md"
                        placeholder="All Types"
                        onValueChange={(type) => store.setSelectedFormType(type)}
                        value={store.selectedFormType}
                    />
                )}
            </Observer>
            <Observer>
                {() => (
                    <ListBox<AdminFormStatus>
                        className="min-w-36 shrink-0"
                        items={AdminFormStatus.values}
                        itemKey={item => item.status}
                        itemRenderer={item => item.name}
                        inputSize="md"
                        placeholder="All Statuses"
                        onValueChange={(status) => store.setSelectedAdminFormStatus(status)}
                        value={store.selectedAdminFormStatus}
                    />
                )}
            </Observer>
        </div>
    );
}

function FormsTable() {
    const store = useAdminFormsListStore();
    const items = store.listVm.items;

    return (
        <div className="overflow-auto datatable-scrollbar h-full">
            <table className="min-w-full text-[13px]">
                <thead className="bg-content2 sticky top-0">
                    <tr>
                        <Th label="Title" />
                        <Th label="Type" />
                        <Th label="Status" />
                        <Th label="Questions" />
                        <Th label="Invites" />
                        <Th label="Responses" />
                        <Th label="Created" className="min-w-[140px]" />
                    </tr>
                </thead>
                <tbody>
                    {items.length ? (
                        items.map((item) => <FormRow key={item.id} item={item} />)
                    ) : (
                        <tr>
                            <td colSpan={7} className="px-3 py-8 text-center text-secondary">
                                No forms found
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
        <th className={`font-semibold text-secondary uppercase whitespace-nowrap text-left align-middle px-3 py-3 text-[11px] ${className}`}>
            {label}
        </th>
    );
}

function FormRow({ item }: { item: AdminFormListTile }) {
    const displayCategories = item.categories?.slice(0, 3) || [];
    const remainingCategories = (item.categories?.length || 0) - 3;

    return (
        <tr className="border-t border-default/60 hover:bg-content2 transition-colors cursor-pointer">
            <Td className="max-w-[300px]">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5">
                        <FormAvatar formType={item.type} />
                        <div className="min-w-0 leading-tight">
                            <div className="text-sm font-medium text-default truncate">{item.title || "Untitled"}</div>
                        </div>
                    </div>
                    {displayCategories.length > 0 && (
                        <div className="flex items-center gap-1 ml-10 flex-wrap">
                            {displayCategories.map((category, index) => (
                                <Badge key={index} variant="soft" color="primary" size="xs">
                                    {category.name}
                                </Badge>
                            ))}
                            {remainingCategories > 0 && (
                                <Badge variant="soft" color="secondary" size="xs">
                                    +{remainingCategories} more
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            </Td>
            <Td>
                <Badge variant="soft" color="secondary" size="xs">
                    {item.type?.name || "Unknown"}
                </Badge>
            </Td>
            <Td>
                <Badge
                    variant="soft"
                    color={
                        item.adminFormStatus?.isActive ? "success" :
                            item.adminFormStatus?.isDraft ? "warning" :
                                item.adminFormStatus?.isClosed ? "danger" : "secondary"
                    }
                    size="xs"
                >
                    {item.adminFormStatus?.name || "Unknown"}
                </Badge>
            </Td>
            <Td>{item.totalQuestions || 0}</Td>
            <Td>{item.totalInvites || 0}</Td>
            <Td>{item.totalResponses || 0}</Td>
            <Td>{DateFmt.datetime(item.createdAt)}</Td>
        </tr>
    );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-3 py-3 whitespace-nowrap align-middle text-default ${className}`}>{children}</td>;
}

function TableErrorView() {
    const store = useAdminFormsListStore();
    return (
        <SimpleRetryableAppView
            className="p-4 border-t border-default"
            appError={store.queryState.error!}
            onRetry={() => store.loadForms({ page: store.currentPage })}
        />
    );
}