import { FormsComposerDoc } from "~/ui/components/formscomposer/core/FormsComposeDoc";
import { FormsComposerEditorRef } from "~/ui/components/formscomposer/FormsComposerEditor";
import { InputValue } from "~/ui/widgets/form/InputValue";

export type FormsComposerFieldVm = {
  value: InputValue<FormsComposerDoc | null>;
  ref: React.RefObject<FormsComposerEditorRef | null>;
};