import { ReactNode, useEffect, useRef } from "react";
import { SubmitContext } from "./SubmitContext";
import { SubmitStore } from "./SubmitStore";
import { useAppStore } from "~/ui/pages/_layout/AppContext";

type SubmitProviderProps = {
    permalink: string;
    responseUid: string | null;
    children: ReactNode;
}

export function SubmitProvider(props: SubmitProviderProps) {
    const appContext = useAppStore();
    const storeRef = useRef<SubmitStore | null>(null);
    if (storeRef.current === null) {
        storeRef.current = new SubmitStore({
            responseUid: props.responseUid,
            permalink: props.permalink,
            appStore: appContext,
        });
    }
    const store = storeRef.current;

    useEffect(() => {
        store.loadFormDetail();
    }, [store]);

    return (
        <SubmitContext.Provider value={store}>
            {props.children}
        </SubmitContext.Provider>
    );
}

