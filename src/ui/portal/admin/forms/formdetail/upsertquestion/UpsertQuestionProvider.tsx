import { Observer } from "mobx-react-lite";
import { Fragment, ReactNode, useEffect, useRef } from "react";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { FormType } from "~/domain/forms/models/FormType";
import { UnknowStateView } from "~/ui/components/errors/UnknowStateView";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { AdminFormStore } from "../layout/AdminFormStore";
import { UpsertQuestionContext } from "./UpsertQuestionContext";
import { UpsertQuestionStore } from "./UpsertQuestionStore";

type UpsertQuestionProviderProps = {
    id: number | null;
    parentId: number | null;
    formId: number;
    formType: FormType;
    adminFormsService: AdminFormsService;
    onClose: (questionNumber: number | null) => void;
    dialogManager: DialogManagerStore;
    children: ReactNode;
    appStore: AppStore;
    formStore: AdminFormStore;
}



function QuestionLoadingShimmer() {
    return (
        <div className="space-y-6">
            <div className="shimmer h-8 bg-gray-200 rounded w-4"></div>
            <div className="shimmer h-4 bg-gray-200 rounded w-4"></div>
            <div className="shimmer h-4 bg-gray-200 rounded w-4"></div>
        </div>
    );
}


export const UpsertQuestionProvider: React.FC<UpsertQuestionProviderProps> = (props) => {
    const storeRef = useRef<UpsertQuestionStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new UpsertQuestionStore({
            id: props.id,
            parentId: props.parentId,
            formId: props.formId,
            formType: props.formType,
            adminFormsService: props.adminFormsService,
            onClose: props.onClose,
            dialogManager: props.dialogManager,
            appStore: props.appStore,
            formStore: props.formStore,
        });
    }
    const store = storeRef.current;

    useEffect(() => {
        store.loadQuestion();
    }, [store]);

    return (
        <UpsertQuestionContext.Provider value={store}>
            <Observer>
                {() => {
                    if (store.qvmState.isData) {
                        return <Fragment
                            key={store.vm.instanceId}>
                            {props.children}
                        </Fragment>;
                    }

                    if (store.qvmState.isInitOrLoading) {
                        return (
                            <Centered>
                                <QuestionLoadingShimmer />
                            </Centered>
                        );
                    }

                    if (store.qvmState.isError) {
                        return (
                            <Centered>
                                <SimpleRetryableAppView
                                    appError={store.qvmState.error}
                                    onRetry={() => store.loadQuestion()}
                                />
                            </Centered>
                        );
                    }

                    return <UnknowStateView />;
                }}
            </Observer>
        </UpsertQuestionContext.Provider>
    );
};

function Centered({ children }: { children: ReactNode }) {
    return <div className="flex items-center justify-center h-full">{children}</div>;
}