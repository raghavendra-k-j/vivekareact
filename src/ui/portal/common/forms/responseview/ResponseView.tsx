import { Observer } from "mobx-react-lite";
import { useEffect } from "react";
import { FormService } from "~/domain/forms/services/FormsService";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { FramedDialog } from "~/ui/widgets/dialogmanager";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { DesktopView } from "./comp/DesktopView";
import { MobileView } from "./comp/MobileView";
import { ResponseDialogViewer } from "./models/ResponseViewViewer";
import { useResponseViewStore } from "./ResponseViewContext";
import { ResponseViewProvider } from "./ResponseViewProvider";

export type ResponseViewProps = {
    formId: number;
    responseUid: string;
    viewer: ResponseDialogViewer;
    formService: FormService;
    onClose: () => void;
    appStore: AppStore;
};



export function ResponseView({ formId, responseUid, viewer, formService, onClose, appStore }: ResponseViewProps) {
    return (
        <FramedDialog
            onClose={() => {
                onClose();
            }}
            scaffoldClassName="p-0 lg:p-4"
            contentClassName="w-full h-full flex flex-col max-w-[1200px] max-h-[800px]"
        >
            <ResponseViewProvider
                appStore={appStore}
                formId={formId}
                responseUid={responseUid}
                viewer={viewer}
                formService={formService}
                onClose={onClose}
            >
                <ResponseBody />
            </ResponseViewProvider>
        </FramedDialog>
    );
}

function ResponseBody() {
    const store = useResponseViewStore();

    useEffect(() => {
        store.loadDetails();
    }, [store]);

    return (
        <Observer>
            {() => {
                return store.detailsState.stateWhen({
                    initOrLoading: () => <Centered><LoaderView /></Centered>,
                    error: (error) => (
                        <Centered>
                            <SimpleRetryableAppView
                                appError={error}
                                onRetry={() => store.loadQuestions()}
                            />
                        </Centered>
                    ),
                    loaded: () => (
                        <>
                            <div className="hidden lg:block h-full overflow-hidden">
                                <DesktopView />
                            </div>
                            <div className="block lg:hidden  h-full">
                                <MobileView />
                            </div>
                        </>
                    ),
                });
            }
            }
        </Observer>
    );
}


function Centered({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-center h-full">
            {children}
        </div>
    );
}



