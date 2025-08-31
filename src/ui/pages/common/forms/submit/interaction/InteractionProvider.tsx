import { type ReactNode, useEffect, useRef } from "react";
import { useSubmitStore } from "../SubmitContext";
import { InteractionContext } from "./InteractionContext";
import { InteractionStore } from "./InteractionStore";
import { STT } from "~/infra/utils/stt/STT";
import { useDialogManager } from "~/ui/widgets/dialogmanager";
import { TTS } from "~/infra/utils/tts/TTS";

type InteractionProviderProps = {
    children: ReactNode;
};

export function InteractionProvider({ children }: InteractionProviderProps) {
    const parentStore = useSubmitStore();
    const dialogManager = useDialogManager();

    const sttRef = useRef<STT | null>(null);
    const storeRef = useRef<InteractionStore | null>(null);
    const ttsRef = useRef<TTS | null>(null);

    if (!storeRef.current) {
        storeRef.current = new InteractionStore({
            parentStore: parentStore,
            dialogManager: dialogManager,
        });
    }

    if (!ttsRef.current) {
        ttsRef.current = new TTS();
    }


    const store = storeRef.current;

    useEffect(() => {
        store.loadQuestions();

        store.tts = ttsRef.current;

        
        if (!sttRef.current) {
            sttRef.current = new STT();
            store.stt = sttRef.current;
        }

        return () => {
            if (sttRef.current) {
                sttRef.current.dispose();
                sttRef.current = null;
                store.dispose();
            }
            if(store.tts) {
                store.tts.stop();
            }
        }
    }, [store]);

    return (
        <InteractionContext.Provider value={store}>
            {children}
        </InteractionContext.Provider>
    );
}
