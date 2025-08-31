import clsx from 'clsx';
import { Mic, SquareRadical } from 'lucide-react';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import 'prosemirror-view/style/prosemirror.css';
import React, { forwardRef, useImperativeHandle, useMemo } from 'react';
import { FormsSTTLaTexOptions, FormsSTTOptions } from '../formssttdialog/models/FormatSTTOptions';
import { FormsComposerSchema } from './core/schema';
import './styles.css';
import styles from "./styles.module.css";
import { useFormsComposer } from './useFormsComposer';

export type FormsComposerOptions = {
    equation?: FormsComposerEquationOptions;
    dictate?: FormsComposerDictateOptions;
}

export type FormsComposerEquationOptions = {
    enabled: boolean;
    enableStt: boolean;
    sttOptions: FormsSTTLaTexOptions | null;
}

export type FormsComposerDictateOptions = {
    enabled: boolean;
    sttOptions: FormsSTTOptions | null;
}


export interface FormsComposerProps {
    schema: FormsComposerSchema;
    initialContent?: ProseMirrorNode | null;
    onChange?: (node: ProseMirrorNode, instanceId: string) => void;
    placeholder?: string;
    minHeight?: string;
    maxHeight?: string;
    options: FormsComposerOptions;
}

export type FormsComposerEditorRef = {
    getContent: () => ProseMirrorNode | null;
    setContent: (doc: ProseMirrorNode) => void;
    insertBlank: () => void;
    viewRef: React.RefObject<EditorView | null>;
    addChangeListener: (listener: (node: ProseMirrorNode) => void) => void;
    removeChangeListener: (listener: (node: ProseMirrorNode) => void) => void;
    instanceId: string;
}

export const FormsComposerEditor = forwardRef(function RichPmEditor(props: FormsComposerProps, ref: React.Ref<FormsComposerEditorRef>) {
    const showToolbar = useMemo(() => {
        return props.options?.equation?.enabled || props.options?.dictate?.enabled;
    }, [props.options]);
    
    const formsComposer = useFormsComposer(props);
    const { options } = props;


    useImperativeHandle(ref, () => ({
        getContent: formsComposer.getContent,
        setContent: formsComposer.setContent,
        insertBlank: formsComposer.insertBlank,
        viewRef: formsComposer.viewRef,
        addChangeListener: formsComposer.addChangeListener,
        removeChangeListener: formsComposer.removeChangeListener,
        instanceId: formsComposer.instanceId,
    }));

    return (
        <div className={styles.richPmEditor}>
            {showToolbar && (
                <div className={styles.toolbar}>
                    {options?.equation?.enabled && (
                        <button className={styles.button} onClick={formsComposer.onClickEquationButton} title="Add Equation">
                            <SquareRadical className={styles.icon} /> Equation
                        </button>
                    )}
                    {options?.dictate?.enabled && (
                        <button className={styles.button} onClick={formsComposer.onClickVoiceButton} title="Voice Input">
                            <Mic className={styles.icon} /> Dictate
                        </button>
                    )}
                </div>
            )}
            <div
                className={clsx(
                    styles.editorContent,
                    showToolbar && styles.hasToolbar
                )}
                onClick={(e) => {
                    return formsComposer.onClickEditableArea(e);
                }}
                ref={formsComposer.editorRef}
                style={{
                    minHeight: props.minHeight,
                    maxHeight: props.maxHeight,
                }}
            ></div>
        </div>
    );
});

