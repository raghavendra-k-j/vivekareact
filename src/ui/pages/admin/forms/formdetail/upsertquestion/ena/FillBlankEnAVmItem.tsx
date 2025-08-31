import React, { createRef } from "react";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { UUIDUtil } from "~/core/utils/UUIDUtil";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";

export type FillBlankEnAVmItemProps = {
    node: ProseMirrorNode | null;
}

export class FillBlankEnAVmItem {
    uid: string;
    ref: React.RefObject<FormsComposerEditorRef | null>;
    node: ProseMirrorNode | null;

    constructor(props: FillBlankEnAVmItemProps) {
        this.uid = UUIDUtil.compact;
        this.ref = createRef<FormsComposerEditorRef | null>();
        this.node = props.node;
    }

    onNodeChanged(node: ProseMirrorNode | null) {
        this.node = node;
    }
}
