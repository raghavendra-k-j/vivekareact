import { DialogCloseButton, DialogFooter, DialogHeader } from "~/ui/components/dialogs/DialogHeaderAndFooter";
import { useEditTranslationStore } from "./EditTranslationContext";
import { EditTranslationProvider } from "./EditTranslationProvider";
import OutlinedButton from "~/ui/widgets/button/OutlinedButton";
import FilledButton from "~/ui/widgets/button/FilledButton";
import { Fragment, useEffect } from "react";
import { Observer } from "mobx-react-lite";
import { LoaderView } from "~/ui/widgets/loader/LoaderView";
import { SimpleRetryableAppView } from "~/ui/widgets/error/SimpleRetryableAppError";
import { FTextField } from "~/ui/widgets/form/TextField";
import { TextareaField } from "~/ui/widgets/form/TextareaField";

export default function EditTranslationView() {
    return (
        <EditTranslationProvider>
            <EditTranslationInner />
        </EditTranslationProvider>
    );
}

function EditTranslationInner() {
    const store = useEditTranslationStore();

    useEffect(() => {
        store.loadTranslation();
    });

    return (
        <div className="bg-surface flex flex-col h-full overflow-hidden">
            <DialogHeader
                title="Edit Translation"
                onClose={<DialogCloseButton onClick={() => {store.sendCloseDialogMessage()}} />}
            />
            <Observer>
                {() => {
                    return store.loadState.stateWhen({
                        initOrLoading: () => (<Centered><LoaderView /></Centered>),
                        error: (error) => (<Centered><SimpleRetryableAppView appError={error} onRetry={() => store.loadTranslation()} /></Centered>),
                        loaded: () => (<><Main />
                            <DialogFooter
                                className="border-t border-default"
                                actions={[
                                    <OutlinedButton key="cancel" onClick={() => store.sendCloseDialogMessage()}>Cancel</OutlinedButton>,
                                    <Observer key="save">
                                        {() => (<FilledButton isLoading={store.saveState.isLoading} onClick={() => { store.saveTranslation(); }}>
                                            Save
                                        </FilledButton>)}
                                    </Observer>
                                ]} /></>),
                    });
                }}
            </Observer>
        </div>
    );
}


function Centered(props: { children: React.ReactNode }) {
    return (<div className="h-full flex flex-col items-center justify-center">{props.children}</div>);
}

function Main() {
    return <div className="flex flex-col h-full overflow-auto p-6 gap-4 bg-background">
        <FormDetails />
        <QuestionsList />
    </div>;
}

function FormDetails() {
    const store = useEditTranslationStore();
    return (
        <div className="flex flex-col gap-4">
            <FTextField
                label="Title"
                field={store.data.title}
                placeholder={`Enter ${store.formType.name.toLowerCase()} title`}
            />
            {store.data.hasDescription && (<TextareaField
                label="Description"
                placeholder={`Enter ${store.formType.name.toLowerCase()} description`}
                rows={2}
                field={store.data.description}
            />)}
        </div>
    );
}

function QuestionsList() {
    const store = useEditTranslationStore();
    return (
        <div className="flex flex-col gap-4">
            {store.data.questions.map((question) => (<Fragment key={question.id}>{question.render()}</Fragment>))}
        </div>
    );
}