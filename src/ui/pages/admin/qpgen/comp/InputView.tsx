import { TextareaField } from "~/ui/widgets/form/TextareaField";
import { useQPGenPageStore } from "../QPGenPageContext";
import FilledButton from "~/ui/widgets/button/FilledButton";
import { Observer } from "mobx-react-lite";
import { UnknowStateView } from "~/ui/components/errors/UnknowStateView";
import { PasteTextView } from "./PasteContentView";
import { FileUploadView } from "./FileUploadView";
import { InputSourceType } from "../models/InputSourceType";
import clsx from "clsx";

export function QPGenInputFormView() {
    return (
        <div className="flex flex-col w-[360px] max-w-[360px]">
            <div className="flex flex-col bg-surface rounded-md border border-default shadow-sm gap-6">
                <InputSourceSelector />
                <SelectedSourceView />
                <OptionsView />
                <FooterView />
            </div>
        </div>
    );
}

function InputSourceSelector() {
    const store = useQPGenPageStore();
    const sourceTypes = [InputSourceType.FileUpload, InputSourceType.Paste];

    return (
        <Observer>
            {() => (
                <div className="border-b border-default">
                    <nav className="flex" role="tablist">
                        {sourceTypes.map((type) => (
                            <TabButton
                                key={type.type}
                                label={type.label}
                                isActive={store.inputStore.sourceType.type === type.type}
                                onClick={() => store.inputStore.onInputSourceTypeChange(type)}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </Observer>
    );
}



type TabButtonProps = {
    label: string;
    isActive: boolean;
    onClick: () => void;
};

export function TabButton({ label, isActive, onClick }: TabButtonProps) {
    return (
        <button
            role="tab"
            aria-selected={isActive}
            onClick={onClick}
            className={clsx(
                "px-4 py-2 text-sm font-bold transition-all border-b-3 focus:outline-none",
                {
                    "border-primary text-primary": isActive,
                    "border-transparent text-default hover:text-primary": !isActive,
                }
            )}
        >
            {label}
        </button>
    );
}



function SelectedSourceView() {
    const store = useQPGenPageStore();
    return (
        <Observer>
            {() => {
                if (store.inputStore.isPaste) {
                    return <PasteTextView />;
                }

                if (store.inputStore.isFileUpload) {
                    return <FileUploadView />;
                }

                return <UnknowStateView />;
            }}
        </Observer>
    );
}

function OptionsView() {
    const store = useQPGenPageStore();

    const samplePattern = [
        "1 mark – 5 questions",
        "2 marks – 5 questions",
        "3 marks – 5 questions",
    ].join("\n");

    const trySamplePattern = () => {
        store.inputStore.descriptionField.set(samplePattern);
    };

    return (
        <div className="px-6 space-y-1">
            <TextareaField
                required
                label="Describe your question paper pattern"
                placeholder="e.g. 1 mark – 5 questions, 2 marks – 5 questions..."
                rows={4}
                field={store.inputStore.descriptionField}
            />

            <button
                type="button"
                onClick={trySamplePattern}
                className="text-sm text-primary hover:underline mt-1"
            >
                Try sample pattern
            </button>
        </div>
    );
}




function FooterView() {
    const store = useQPGenPageStore();
    return (
        <div className="flex justify-end px-6 pb-4">
            <FilledButton
                onClick={() => store.generatePaper()}
            >
                Generate Question Paper
            </FilledButton>
        </div>
    );
}
