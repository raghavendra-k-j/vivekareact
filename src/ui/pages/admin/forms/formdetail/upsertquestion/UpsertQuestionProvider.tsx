import { Fragment, ReactNode, useEffect, useRef } from "react";
import { UpsertQuestionStore } from "./UpsertQuestionStore";
import { UpsertQuestionContext } from "./UpsertQuestionContext";
import { Observer } from "mobx-react-lite";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { UnknowStateView } from "~/ui/components/errors/UnknowStateView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { FormType } from "~/domain/forms/models/FormType";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { DialogManagerStore } from "~/ui/widgets/dialogmanager";
import { AppStore } from "~/ui/pages/_layout/AppStore";
import { AdminFormStore } from "../layout/AdminFormStore";

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
                                <LoaderView />
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