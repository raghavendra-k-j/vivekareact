import clsx from "clsx";
import { Edit, Plus } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { DateFmt } from "~/core/utils/DateFmt";
import { AdminCategoryListTile } from "~/domain/forms/admin/models/categories/AdminQueryCategoriesModels";
import { AdminFormCategoriesService } from "~/domain/forms/admin/services/AdminFormCategoriesService";
import { Card, CardBody, CardFooter, CardHeader } from "~/ui/components/card";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { Input } from "~/ui/widgets/form/Input";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { AdminPageAppBar, AdminPageAppBarTitle } from "../../components/PageAppBar";
import { CategoriesPageContext, useCategoriesPageStore } from "./CategoriesPageContext";
import { CategoriesPageStore } from "./CategoriesPageStore";
import { CategoryDialog } from "./CategoryDialog";

function PageProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<CategoriesPageStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new CategoriesPageStore({ categoriesService: new AdminFormCategoriesService() });
    }
    return <CategoriesPageContext.Provider value={storeRef.current}>{children}</CategoriesPageContext.Provider>;
}

export default function CategoriesPage() {
    return (
        <PageProvider>
            <CategoriesPageInner />
        </PageProvider>
    );
}

function CategoriesPageInner() {
    const store = useCategoriesPageStore();

    useEffect(() => {
        store.loadCategories({ page: 1 });
    }, [store]);

    return (
        <div className="w-full">
            <AdminPageAppBar start={<AdminPageAppBarTitle title="Manage Categories" />} />
            <div className="p-6">
                <Card>
                    <CardHeader divider className="px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                            <SearchBar />
                            <div className="flex flex-row gap-2">
                                <Button variant="solid" color="primary" icon={<Plus className="w-4 h-4" />} onClick={() => store.openCreateDialog()}>
                                    Create Category
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardBody className="p-0">
                        <Observer>
                            {() =>
                                store.loadState.stateWhen({
                                    initOrLoading: () => <CenteredLoader />,
                                    error: () => <TableErrorView />,
                                    loaded: () => <CategoriesTable />,
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
            <CategoryDialog
                isOpen={store.showCreateDialog}
                mode="create"
                onClose={() => store.closeCreateDialog()}
                onSubmit={(name) => store.createCategory(name)}
            />
            <CategoryDialog
                isOpen={store.showEditDialog}
                mode="edit"
                initialName={store.editingCategoryId ? store.loadState.data?.items.find(item => item.id === store.editingCategoryId)?.name : undefined}
                onClose={() => store.closeEditDialog()}
                onSubmit={(name) => store.editCategory(store.editingCategoryId!, name)}
            />
        </div>
    );
}

function SearchBar() {
    const store = useCategoriesPageStore();
    return (
        <div className="w-full max-w-md">
            <Input
                inputSize="md"
                placeholder="Search categories by name"
                type="search"
                className="font-medium"
                onChange={(e) => store.setSearchText(e.target.value)}
            />
        </div>
    );
}

function CategoriesTable() {
    const store = useCategoriesPageStore();
    const items = store.loadState.data!.items as AdminCategoryListTile[];

    return (
        <div className="overflow-x-auto datatable-scrollbar">
            <table className="min-w-full text-[13px]">
                <thead className="bg-content2">
                    <tr>
                        <Th label="Name" />
                        <Th label="Created" className="min-w-[140px]" />
                        <Th label="Actions" className="min-w-[100px]" />
                    </tr>
                </thead>
                <tbody>
                    {items.length ? (
                        items.map((item) => <CategoryRow key={item.id} item={item} />)
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center text-default py-5 px-3">
                                No categories found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function Th({
    label,
    className,
}: {
    label?: string;
    className?: string;
}) {
    return (
        <th
            className={clsx(
                "font-semibold text-secondary uppercase whitespace-nowrap text-left align-middle px-4 py-2 text-sm",
                className
            )}
        >
            <span>{label}</span>
        </th>
    );
}

function CategoryRow({ item }: { item: AdminCategoryListTile }) {
    const store = useCategoriesPageStore();
    return (
        <tr className="border-t border-default/60 hover:bg-content2 transition-colors">
            <Td className="max-w-[340px]">
                <div className="min-w-0 leading-tight">
                    <span className="font-medium text-default truncate">{item.name}</span>
                </div>
            </Td>
            <Td>{DateFmt.datetime(item.createdAt)}</Td>
            <Td>
                <Button
                    variant="ghost"
                    size="sm"
                    icon={<Edit className="w-4 h-4" />}
                    onClick={() => store.openEditDialog(item.id)}
                >
                    Edit
                </Button>
            </Td>
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
                <div className="min-w-0 leading-tight">
                    <div className="w-24 h-4 bg-gray-300 animate-pulse mb-1"></div>
                </div>
            </Td>
            <Td><div className="w-24 h-4 bg-gray-300 animate-pulse"></div></Td>
            <Td><div className="w-16 h-4 bg-gray-300 animate-pulse"></div></Td>
        </tr>
    );
}

function TableErrorView() {
    const store = useCategoriesPageStore();
    return (
        <SimpleRetryableAppView
            className="p-4 border-t border-default"
            appError={store.loadState.error!}
            onRetry={() => store.loadCategories({ page: 1 })}
        />
    );
}

function CenteredLoader() {
    return (
        <div className="overflow-x-auto datatable-scrollbar">
            <table className="min-w-full text-[13px]">
                <thead className="bg-content2">
                    <tr>
                        <Th label="Name" />
                        <Th label="Created" className="min-w-[140px]" />
                        <Th label="Actions" className="min-w-[100px]" />
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, i) => <ShimmerRow key={i} />)}
                </tbody>
            </table>
        </div>
    );
}
