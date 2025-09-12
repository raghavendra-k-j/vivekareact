import React, { useRef } from "react";
import { FormService } from "~/domain/forms/services/FormsService";
import { ResponseViewContext } from "./ResponseViewContext";
import type { ResponseDialogViewer } from "./models/ResponseViewViewer";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { ResponseViewStore } from "./ResponseViewStore";

export type ResponseViewProviderProps = {
    appStore: AppStore;
    formId: number;
    responseUid: string;
    viewer: ResponseDialogViewer;
    children: React.ReactNode;
    formService: FormService;
    onClose: () => void;
};

export function ResponseViewProvider(props: ResponseViewProviderProps) {
    const storeRef = useRef<ResponseViewStore | null>(null);
    if (storeRef.current === null) {
        storeRef.current = new ResponseViewStore({
            formId: props.formId,
            responseUid: props.responseUid,
            viewer: props.viewer,
            formService: props.formService,
            onClose: props.onClose,
            appStore: props.appStore,
        });
    }
    const store = storeRef.current;

    return (
        <ResponseViewContext.Provider value={store}>
            {props.children}
        </ResponseViewContext.Provider>
    );
}