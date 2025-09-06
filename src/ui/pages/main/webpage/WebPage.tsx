import { Observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { useParams } from "react-router";
import { WebPageRes } from "~/domain/common/models/WebPageRes";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { MainLayoutContainer } from "../home/comp/MainLayoutContainer";
import { useWebPageContext, WebPageContext } from "./WebPageContext";
import { WebPageStore } from "./WebPageStore";

function WebPageProvider({ children }: { children: React.ReactNode }) {
    const { slug } = useParams<{ slug: string }>();
    const store = useRef<WebPageStore>(new WebPageStore({ slug: slug || "" }));
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

function PageCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="container py-6 sm:py-10">
            <div className="mx-auto max-w-3xl rounded-lg shadow bg-white dark:bg-gray-900 p-6 sm:p-8">
                {children}
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
                                <LoaderView />
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
