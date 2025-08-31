import { FTextareaField } from "~/ui/widgets/form/input/FTextareaField";
import { useQPGenPageStore } from "../QPGenPageContext";

export function PasteTextView() {
  const store = useQPGenPageStore();
  return (
    <div className="px-6 h-48">
      <FTextareaField
        label="Paste Text"
        placeholder="Paste your content here..."
        rows={7}
        field={store.inputStore.pasteSource.contentField}
      />
    </div>
  );
}