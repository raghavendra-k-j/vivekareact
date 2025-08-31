import React, { useRef } from "react";
import { ResponseViewContext } from "./ResponseViewContext";
import { ResponseViewStore } from "./ResponseViewStore";
import type { ResponseDialogViewer } from "./models/ResponseViewViewer";
import { FormService } from "~/domain/forms/services/FormsService";
import { useAppStore } from "~/ui/pages/_layout/AppContext";

export type ResponseViewProviderProps = {
    formId: number;
    responseUid: string;
    viewer: ResponseDialogViewer;
    children: React.ReactNode;
    formService: FormService;
    onClose: () => void;
};

export function ResponseViewProvider(props: ResponseViewProviderProps) {
    const appStore = useAppStore();
    const storeRef = useRef<ResponseViewStore | null>(null);
    if (storeRef.current === null) {
        storeRef.current = new ResponseViewStore({
            formId: props.formId,
            responseUid: props.responseUid,
            viewer: props.viewer,
            formService: props.formService,
            onClose: props.onClose,
            appStore: appStore,
        });
    }
    const store = storeRef.current;

    return (
        <ResponseViewContext.Provider value={store}>
            {props.children}
        </ResponseViewContext.Provider>
    );
}