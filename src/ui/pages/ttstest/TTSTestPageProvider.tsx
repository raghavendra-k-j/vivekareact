import { useEffect, useRef } from "react";
import { TTSTestPageStore } from "./TTSTestPageStore";
import { TTSTestPageContext } from "./TTSTestPageContext";
import { TTS } from "~/infra/utils/tts/TTS";

export type TTSTestPageProviderProps = {
    children: React.ReactNode;
}

export function TTSTestPageProvider(props: TTSTestPageProviderProps) {
    const ttsRef = useRef<TTS | null>(null);
    if (ttsRef.current === null) {
        ttsRef.current = new TTS();
    }

    const storeRef = useRef<TTSTestPageStore | null>(null);
    if (storeRef.current === null) {
        storeRef.current = new TTSTestPageStore();
    }
    const store = storeRef.current;

    useEffect(() => {
        store.onMount({
            tts: ttsRef.current!,
        });

        return () => {
            store.onUnmount();
        }
    }, [store]);

    return (
        <TTSTestPageContext.Provider value={store}>
            {props.children}
        </TTSTestPageContext.Provider>
    );
}