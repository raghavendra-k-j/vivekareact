import { FValue } from "~/ui/widgets/form/FValue";
import { FormsComposerEditorRef } from "./FormsComposerEditor";
import { FormsComposerDoc } from "./core/FormsComposeDoc";
import React from "react";


export type FCFieldProps = {
    ref: React.RefObject<FormsComposerEditorRef | null>;
    value: FValue<FormsComposerDoc | null>;
}

export class FCField {
    ref: React.RefObject<FormsComposerEditorRef | null>;
    value: FValue<FormsComposerDoc | null>;

    constructor(props: FCFieldProps) {
        this.ref = props.ref;
        this.value = props.value;
    }

    static fromValue(value: FValue<FormsComposerDoc | null>) {
        return new FCField({
            ref: React.createRef<FormsComposerEditorRef | null>(),
            value: value
        });
    }

}