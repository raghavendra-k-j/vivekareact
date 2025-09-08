import clsx from "clsx";
import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { WebPageRes } from "~/domain/common/models/WebPageRes";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { MainLayoutContainer } from "../home/comp/MainLayoutContainer";
import { useWebPageContext, WebPageContext } from "./WebPageContext";
import { WebPageStore } from "./WebPageStore";

function WebPageProvider({ children }: { children: React.ReactNode }) {
    const { slug } = useParams<{ slug: string }>();
    const store = useRef<WebPageStore | null>(null);
    if (!store.current) {
        store.current = new WebPageStore({ slug: slug || "" })
    }
    return (
        <WebPageContext.Provider value={store.current}>
            {children}
        </WebPageContext.Provider>
    );
}

export default function WebPage() {
    return (
        <WebPageProvider>
            <WebPageInner />
        </WebPageProvider>
    );
}

function PageCard({ children, className, innerClassName }: { children: React.ReactNode, innerClassName?: string, className?: string }) {
    return (
        <div className={clsx("container py-6 sm:py-10", className)}>
            <div className={clsx("mx-auto max-w-3xl rounded-lg shadow bg-white dark:bg-gray-900 p-6 sm:p-8", innerClassName)}>
                {children}
            </div>
        </div>
    );
}


function PageLoadingShimmer() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
        </div>
    );
}


function WebPageInner() {
    const store = useWebPageContext();
    return (
        <MainLayoutContainer>
            <Observer>
                {() =>
                    store.dataState.stateWhen({
                        initOrLoading: () => (
                            <PageCard>
                                <PageLoadingShimmer />
                            </PageCard>
                        ),
                        error: (error) => (
                            <PageCard>
                                <SimpleRetryableAppView
                                    appError={error}
                                    onRetry={() => store.loadWebPage()}
                                />
                            </PageCard>
                        ),
                        loaded: (webPage) => (
                            <PageCard>
                                <PageContent webPage={webPage} />
                            </PageCard>
                        ),
                    })
                }
            </Observer>
        </MainLayoutContainer>
    );
}

function PageContent({ webPage }: { webPage: WebPageRes }) {
    useEffect(() => {
        document.title = webPage.title;
    }, [webPage.title]);

    const updated =
        webPage.updatedAt instanceof Date
            ? webPage.updatedAt
            : new Date(webPage.updatedAt);

    return (
        <article className="max-w-none">
            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-default">
                    {webPage.title}
                </h1>
                <p className="mt-2 text-xs text-secondary">
                    Updated on{" "}
                    {updated.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                    })}
                </p>
            </header>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-relaxed">
                <div
                    className="prose-base"
                    dangerouslySetInnerHTML={{ __html: webPage.content }}
                />
            </div>
        </article>
    );
}
