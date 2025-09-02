import React, { forwardRef, useEffect, useRef } from "react";
import { InputLabel } from "~/ui/widgets/form/InputLabel";
import {
    FormsComposerEditor,
    FormsComposerProps,
    FormsComposerEditorRef
} from "./FormsComposerEditor";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { InputError } from "~/ui/widgets/form/InputError";
import { Observer } from "mobx-react-lite";
import { FormsComposerDoc } from "./core/FormsComposeDoc";

export type FormsComposerFieldProps = FormsComposerProps & {
    label: React.ReactNode | string;
    value: InputValue<FormsComposerDoc | null>;
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
                <InputLabel>{label}</InputLabel>
                <FormsComposerEditor
                    ref={ref}
                    initialContent={value.value}
                    {...editorProps}
                />
                <Observer>
                    {() =>
                        value.error ? <InputError>{value.error}</InputError> : null
                    }
                </Observer>
            </div>
        );
    }
);
