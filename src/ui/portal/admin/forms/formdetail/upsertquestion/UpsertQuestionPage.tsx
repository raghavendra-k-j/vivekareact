import { Observer } from "mobx-react-lite";
import { useSearchParams } from "react-router";
import { AdminFormsService } from "~/domain/forms/admin/services/AdminFormsService";
import { FormType } from "~/domain/forms/models/FormType";
import { useAppStore } from "~/ui/portal/layout/app/AppContext";
import { AppStore } from "~/ui/portal/layout/app/AppStore";
import { Button } from "~/ui/widgets/button/Button";
import { DialogManagerStore, useDialogManager } from "~/ui/widgets/dialogmanager";
import { useAdminFormStore } from "../layout/AdminFormContext";
import { AdminFormStore } from "../layout/AdminFormStore";
import { useUpsertQuestionStore } from "./UpsertQuestionContext";
import { UpsertQuestionForm } from "./UpsertQuestionForm";
import { UpsertQuestionProvider } from "./UpsertQuestionProvider";


export type UpsertQuestionDialogProps = {
    id: number | null;
    parentId: number | null;
    formId: number;
    formType: FormType;
    adminFormsService: AdminFormsService;
    dialogManager: DialogManagerStore;
    onClose: (questionId: number | null) => void;
    appStore: AppStore;
    formStore: AdminFormStore;
};

export default function UpsertQuestionPage() {
    const [searchParams] = useSearchParams();
    const questionId = searchParams.get("questionId");
    const parentId = searchParams.get("parentId");
    const formStore = useAdminFormStore();
    const dialogManager = useDialogManager();
    const appStore = useAppStore();

    const props: UpsertQuestionDialogProps = {
        id: questionId ? parseInt(questionId) : null,
        parentId: parentId ? parseInt(parentId) : null,
        formId: formStore.fd.id,
        formType: formStore.fd.type,
        adminFormsService: formStore.adminFormService,
        onClose: (questionId: number | null) => {
            window.parent.postMessage(JSON.stringify({ eventType: "closeDialog", questionId: questionId }), "*");
        },
        dialogManager: dialogManager,
        appStore: appStore,
        formStore: formStore,
    }

    return (
        <UpsertQuestionProvider {...props}>
            <UpsertQuestionInner />
        </UpsertQuestionProvider>
    );
}

function UpsertQuestionInner() {
    return (
        <div className="flex flex-col h-full bg-surface">
            <UpsertQuestionForm />
            <Footer />
        </div>
    );
}


function Footer() {
    const store = useUpsertQuestionStore();
    return (
        <div className="flex rounded-b-sm justify-end gap-3 px-3 py-2 border-t border-default">
            <Button
                variant="outline"
                color="secondary"
                onClick={() => store.sendCloseDialogMessage()}
            >
                Cancel
            </Button>
            <Observer>
                {() => (
                    <Button
                        loading={store.saveState.isLoading}
                        disabled={store.saveState.isLoading}
                        onClick={() => store.saveQuestion()}
                    >
                        Save
                    </Button>
                )}
            </Observer>
        </div>
    );
}