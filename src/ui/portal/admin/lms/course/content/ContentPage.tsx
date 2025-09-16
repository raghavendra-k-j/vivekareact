import { FileText, Plus } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { DateFmt } from "~/core/utils/DateFmt";
import { AdminCCItem } from "~/domain/lms/models/AdminCCItem";
import { Card, CardBody, CardHeader } from "~/ui/components/card";
import { Badge } from "~/ui/widgets/badges/Badge";
import { Button } from "~/ui/widgets/button/Button";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { Input } from "~/ui/widgets/form/Input";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { Pagination } from "~/ui/widgets/pagination/Pagination";
import { useCoursePageStore } from "../CoursePageContext";
import { ContentContext, useContentStore } from "./ContentContext";
import { ContentStore } from "./ContentStore";

function ContentProvider({ children }: { children: React.ReactNode }) {
    const store = useRef<ContentStore | null>(null);
    const layoutStore = useCoursePageStore();
    if (store.current === null) {
        store.current = new ContentStore({
            layoutStore: layoutStore
        });
    }
    return <ContentContext.Provider value={store.current}>{children}</ContentContext.Provider>;
}

export default function ContentPage() {
    return (
        <ContentProvider>
            <ContentPageInner />
        </ContentProvider>
    );
}

function ContentPageInner() {
    const store = useContentStore();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            const courseId = parseInt(id, 10);
            store.setCourseId(courseId);
            store.loadContents({ page: 1 });
        }
    }, [store, id]);

    return (
        <div className="w-full">
            <div className="p-6">
                <Card>
                    <CardHeader divider className="px-3 py-2">
                        <div className="flex items-center justify-between gap-3">
                            <SearchBar />
                            <div className="flex flex-row gap-2">
                                <Button
                                    color="primary"
                                    variant="solid"
                                    size="md"
                                    onClick={() => console.log('New Survey clicked')}
                                >
                                    New Survey
                                </Button>
                                <Button
                                    color="primary"
                                    variant="solid"
                                    size="md"
                                    onClick={() => console.log('New Assessment clicked')}
                                >
                                    New Assessment
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
                                    loaded: () => <ContentsTable />,
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


function SearchBar() {
    const store = useContentStore();
    return (
        <div className="w-full max-w-md">
            <Input
                inputSize="md"
                placeholder="Search content by title..."
                type="search"
                className="font-medium"
                value={store.searchQuery}
                onChange={(e) => store.setSearchQuery(e.target.value)}
            />
        </div>
    );
}

function ContentsTable() {
    const store = useContentStore();
    const items = store.listVm.items;

    return (
        <div className="overflow-x-auto datatable-scrollbar">
            <table className="min-w-full text-[13px]">
                <thead className="bg-content2">
                    <tr>
                        <Th label="Title" />
                        <Th label="Type" />
                        <Th label="Status" />
                        <Th label="Questions" />
                        <Th label="Responses" />
                        <Th label="Created" className="min-w-[140px]" />
                    </tr>
                </thead>
                <tbody>
                    {items.length ? (
                        items.map((item) => <ContentRow key={item.id} item={item} />)
                    ) : (
                        <tr>
                            <td colSpan={6} className="px-3 py-8 text-center text-secondary">
                                No content found
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

function ContentRow({ item }: { item: AdminCCItem }) {
    return (
        <tr className="border-t border-default/60 hover:bg-content2 transition-colors cursor-pointer">
            <Td className="max-w-[300px]">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg ring-1 ring-blue-200/50">
                        <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 leading-tight">
                        <div className="text-sm font-medium text-default truncate">{item.title}</div>
                        {item.topic && (
                            <div className="text-[11px] text-secondary truncate">{item.topic.name}</div>
                        )}
                    </div>
                </div>
            </Td>
            <Td>
                <Badge variant="soft" color="secondary" size="xs">
                    {item.type.name}
                </Badge>
            </Td>
            <Td>
                <Badge
                    variant="soft"
                    color={item.adminFormStatus.isActive ? "success" : item.adminFormStatus.isDraft ? "warning" : "secondary"}
                    size="xs"
                >
                    {item.adminFormStatus.name}
                </Badge>
            </Td>
            <Td>{item.totalQuestions}</Td>
            <Td>{item.totalResponses}</Td>
            <Td>{DateFmt.datetime(item.createdAt)}</Td>
        </tr>
    );
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return <td className={`px-3 py-1.5 whitespace-nowrap align-middle text-default ${className}`}>{children}</td>;
}

function TableErrorView() {
    const store = useContentStore();
    return (
        <SimpleRetryableAppView
            className="p-4 border-t border-default"
            appError={store.queryState.error!}
            onRetry={() => store.loadContents({ page: store.currentPage })}
        />
    );
}