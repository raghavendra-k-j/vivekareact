import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";
import { FValue } from "~/ui/widgets/form/FValue";

export type FormsComposerFieldVm = {
  value: FValue<FormsComposerDoc | null>;
  ref: React.RefObject<FormsComposerEditorRef | null>;
};