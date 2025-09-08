import React, { useRef } from "react";
import { FormService } from "~/domain/forms/services/FormsService";
import { AppStore } from "~/ui/pages/_layout/AppStore";
import { ResponseViewContext } from "./ResponseViewContext";
import { ResponseViewStore } from "./ResponseViewStore";
import type { ResponseDialogViewer } from "./models/ResponseViewViewer";

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