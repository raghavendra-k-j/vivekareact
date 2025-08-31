import React, { forwardRef, useEffect, useRef } from "react";
import { FLabel } from "~/ui/widgets/form/FLabel";
import {
    FormsComposerEditor,
    FormsComposerProps,
    FormsComposerEditorRef
} from "./FormsComposerEditor";
import { FValue } from "~/ui/widgets/form/FValue";
import { FError } from "~/ui/widgets/form/FError";
import { Observer } from "mobx-react-lite";
import { FormsComposerDoc } from "./core/FormsComposeDoc";

export type FormsComposerFieldProps = FormsComposerProps & {
    label: React.ReactNode | string;
    value: FValue<FormsComposerDoc | null>;
    autoSync?: boolean;
};

export const FormsComposerField = forwardRef<FormsComposerEditorRef, FormsComposerFieldProps>(
    (props, ref) => {
        const { label, value, autoSync, ...editorProps } = props;

        const listenerRef = useRef<((doc: FormsComposerDoc) => void) | null>(null);
        const valueRef = useRef(value);

        useEffect(() => {
            valueRef.current = value;
        }, [value]);

        useEffect(() => {
            if (!autoSync) return;
            if (!ref || typeof ref !== "object" || !ref.current) return;

            const editorRef = ref.current;
            const listener = (doc: FormsComposerDoc) => {
                valueRef.current.set(doc); // always latest value
            };

            listenerRef.current = listener;
            editorRef.addChangeListener(listener);

            return () => {
                if (listenerRef.current) {
                    editorRef.removeChangeListener(listenerRef.current);
                }
            };
        }, [autoSync, ref]);

        return (
            <div className="flex flex-col gap-1">
                <FLabel>{label}</FLabel>
                <FormsComposerEditor
                    ref={ref}
                    initialContent={value.value}
                    {...editorProps}
                />
                <Observer>
                    {() =>
                        value.error ? <FError>{value.error}</FError> : null
                    }
                </Observer>
            </div>
        );
    }
);
