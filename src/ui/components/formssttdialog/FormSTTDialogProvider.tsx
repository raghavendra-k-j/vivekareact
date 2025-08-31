import { useEffect, useRef } from "react";
import { FormsSTTDialogContext } from "./FormSTTDialogContext";
import { FormsSTTDialogStore } from "./FormSTTDialogStore";
import { STT } from "~/infra/utils/stt";
import { InstanceId } from "~/core/utils/InstanceId";
import { FormsSTTOptions } from "./models/FormatSTTOptions";
import { FormsSTTRes } from "~/domain/forms/stt/FormsSTTRes";


export type FormsSTTDialogProviderProps = {
    children: React.ReactNode;
    options: FormsSTTOptions;
    onClose: () => void;
    onDone: (res: FormsSTTRes) => void;
}

export function FormsSTTDialogProvider(props: FormsSTTDialogProviderProps) {
    const storeRef = useRef<FormsSTTDialogStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = new FormsSTTDialogStore({
            options: props.options,
            onClose: props.onClose,
            onDone: props.onDone,
        });
    }
    const store = storeRef.current!;

    const sttRef = useRef<STT | null>(null);

    useEffect(() => {
        if (!sttRef.current) {
            sttRef.current = new STT({ instanceId: InstanceId.generate("FormsSTTDialog") });
            store.stt = sttRef.current;
        }

        return () => {
            if (sttRef.current) {
                sttRef.current.dispose();
                sttRef.current = null;
                store.stt = null;
            }
        }
    }, [store]);

    useEffect(() => {
        const timer = setTimeout(() => {
            store.startListening();
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [store]);

    return (
        <FormsSTTDialogContext.Provider value={storeRef.current}>
            {props.children}
        </FormsSTTDialogContext.Provider>
    );
}