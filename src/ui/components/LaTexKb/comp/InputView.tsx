import React, { useEffect, useRef, useState } from "react";

import { Mic } from "lucide-react";
import "mathlive";
import type { MathfieldElement } from "mathlive";
import { useCallback } from "react";
import { FormsSTTRes } from "~/domain/forms/stt/FormsSTTRes";
import { useDialogManager, type DialogEntry } from "~/ui/widgets/dialogmanager";
import { FormsSTTDialog, FormsSTTDialogProps } from "../../formssttdialog/FormsSTTDialog";
import { LaTexKbStore } from "../LaTextKbStore";
import styles from "./../style.module.css";

type InputViewProps = {
    onReady: (mf: MathfieldElement) => void;
    store: LaTexKbStore;
};

function InputViewComponent({ onReady, store }: InputViewProps) {
    const [isDefined, setIsDefined] = useState(false);
    const mfRef = useRef<MathfieldElement | null>(null);
    const hasCalledReady = useRef(false);

    useEffect(() => {
        const defineMathField = async () => {
            await window.customElements.whenDefined("math-field");
            (window as any).MathfieldElement.fontsDirectory = "/packages/mathlive/fonts";
            (window as any).MathfieldElement.soundsDirectory = "/packages/mathlive/sounds";
            setIsDefined(true);
        };
        defineMathField();
    }, []);

    useEffect(() => {
        if (isDefined && mfRef.current && !hasCalledReady.current) {
            onReady(mfRef.current);
            mfRef.current.mathVirtualKeyboardPolicy = "manual";
            hasCalledReady.current = true;
        }
    }, [isDefined, onReady]);

    if (!isDefined) {
        return <div className={styles.inputContainer}></div>;
    }

    return (
        <div className={styles.inputContainer}>
            <math-field
                placeholder="\text{Enter a formula}"
                className={styles.input}
                ref={mfRef}
            ></math-field>
            {store.sttOptions && (<LaTexKbListenButton
                store={store}
                onResult={(transcription) => { if (mfRef.current) { mfRef.current.value = transcription; } }}
            />)}
        </div>
    );
}

export const InputView = React.memo(InputViewComponent);



type LaTexKbListenButtonProps = {
    store: LaTexKbStore;
    onResult: (transaction: string) => void;
};

export function LaTexKbListenButton({ store, onResult }: LaTexKbListenButtonProps) {
    const dialogManager = useDialogManager();
    const options = store.sttOptions!;

    const openVoiceDialog = useCallback(() => {
        const dialogId = "stt-latex-dialog";
        const entry: DialogEntry<FormsSTTDialogProps> = {
            id: dialogId,
            component: FormsSTTDialog,
            props: {
                options: options,
                onClose: () => {
                    dialogManager.closeById(dialogId);
                },
                onDone: (res: FormsSTTRes) => {
                    dialogManager.closeById(dialogId);
                    if(!res.isLatex) return;
                    onResult(res.asLatex.latex);
                }
            }
        };

        dialogManager.show(entry);
    }, [onResult, dialogManager]);

    return (
        <button
            onClick={openVoiceDialog}
            className="p-2 cursor-pointer rounded-sm bg-surface hover:bg-primary-50 transition-colors duration-200"
            aria-label="Start Voice Input"
        >
            <Mic size={20} className="text-default" />
        </button>
    );
}
