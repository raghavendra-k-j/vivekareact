import { Node as ProseMirrorNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef } from 'react';
import { InstanceId } from '~/core/utils/InstanceId';
import { logger } from '~/core/utils/logger';
import { useDialogManager } from '~/ui/widgets/dialogmanager';
import { getEditorContent, setEditorContent } from './commands/common';
import { insertBlankNode } from './commands/fillBlank';
import { openNewEquationDialog } from './commands/latex';
import { onClickVoiceButton } from './commands/stt';
import { createState, createView, handleInitData } from './editorSetup';
import { FormsComposerProps } from './FormsComposerEditor';
import { OnClickLaTexNodeView } from './nodes/LaTexNodeView';
import './styles.css';

export type UseFormsComposerData = {
    onClickEquationButton: () => void;
    onClickLaTexNode: OnClickLaTexNodeView;
    onClickEditableArea: (event: React.MouseEvent<HTMLDivElement>) => void;
    onClickVoiceButton: () => void;
    editorRef: React.RefObject<HTMLDivElement | null>;
    getContent: () => ProseMirrorNode | null;
    setContent: (doc: ProseMirrorNode) => void;
    insertBlank: () => void;
    viewRef: React.RefObject<EditorView | null>;
    addChangeListener: (listener: (doc: ProseMirrorNode) => void) => void;
    removeChangeListener: (listener: (doc: ProseMirrorNode) => void) => void;
    instanceId: string;
}

export function useFormsComposer(props: FormsComposerProps): UseFormsComposerData {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const viewRef = useRef<EditorView | null>(null);
    const dialogManager = useDialogManager();
    const changeListeners = useRef(new Set<(doc: ProseMirrorNode) => void>());
    const instanceIdRef = useRef<string>(InstanceId.generate("RichPmEditor"));

    const addChangeListener = (listener: (doc: ProseMirrorNode) => void) => {
        changeListeners.current.add(listener);
    };

    const removeChangeListener = (listener: (doc: ProseMirrorNode) => void) => {
        changeListeners.current.delete(listener);
    };

    useEffect(() => {
        if (!editorRef.current) return;

        // Handle initial content
        const docNode = handleInitData(props);
        const state = createState(docNode, props);

        const view = createView({
            instanceId: instanceIdRef.current,
            composerProps: props,
            editorRef: editorRef,
            viewRef: viewRef,
            state: state,
            dialogManager: dialogManager,
            changeListeners: changeListeners
        });
        viewRef.current = view;

        return () => {
            view.destroy();
            viewRef.current = null;
        };
    }, [dialogManager, props, props.initialContent]);



    // Handle click on editable area
    const onClickEditableArea = (event: React.MouseEvent<HTMLDivElement>) => {
        if (viewRef.current && !viewRef.current.hasFocus()) {
            const pmSurface = editorRef.current?.querySelector('.ProseMirror');
            if (event.target === editorRef.current || event.target === pmSurface) {
                viewRef.current.focus();
            }
        }
    };

    const getContent = () => {
        if (!viewRef.current) {
            logger.error("Editor view not available for getting content.");
            return null;
        }
        return getEditorContent(viewRef.current);
    };

    const setContent = (doc: ProseMirrorNode) => {
        if (!viewRef.current) {
            logger.error("Editor view not available for setting content.");
            return;
        }
        setEditorContent(viewRef.current, doc);
    };


    const insertBlank = () => {
        if (!viewRef.current) {
            logger.error("Editor view not available for inserting blank.");
            return;
        }
        insertBlankNode(viewRef.current, props.schema);
    }

    const handleOnClickEquationButton = () => {
        if (!viewRef.current) {
            logger.warn("EditorView is not available for LaTeX insertion.");
            return;
        }
        openNewEquationDialog({
            view: viewRef.current,
            dialogManager: dialogManager,
            schema: props.schema,
            sttOptions: props.options.equation?.sttOptions || null,
            enableStt: props.options.equation?.enableStt || false,
        });
    }

    const handleOnClickVoiceButton = () => {
        if(!props.options.dictate?.sttOptions) {
            logger.warn("STT options are not available for voice input.");
            return;
        }
        onClickVoiceButton({
            view: viewRef.current,
            dialogManager: dialogManager,
            schema: props.schema,
            options: props.options.dictate!.sttOptions!,
        });
    }


    return {
        onClickEquationButton: handleOnClickEquationButton,
        onClickLaTexNode: handleOnClickEquationButton,
        onClickEditableArea: onClickEditableArea,
        onClickVoiceButton: handleOnClickVoiceButton,
        editorRef: editorRef,
        getContent: getContent,
        setContent: setContent,
        insertBlank: insertBlank,
        viewRef: viewRef,
        addChangeListener: addChangeListener,
        removeChangeListener: removeChangeListener,
        instanceId: InstanceId.generate("RichPmEditor")
    };
}