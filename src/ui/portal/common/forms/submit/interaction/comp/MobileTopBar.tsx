import { useInteractionStore } from "../InteractionContext";
import { DialogEntry, useDialogManager } from "~/ui/widgets/dialogmanager";
import { Info } from "lucide-react";
import { Observer } from "mobx-react-lite";
import styles from "./../styles.module.css";
import { scrollToQuestion } from "../utils/questionScrollUtil";
import { FormDetailBottomSheet, FormDetailBottomSheetProps, QuestionsBottomSheet, QuestionsBottomSheetProps } from "./FooterBottomSheet";
import { Button } from "~/ui/widgets/button/Button";


export function MobileTopBar() {
    const store = useInteractionStore();
    const dialogmanager = useDialogManager();

    const openQuestionList = () => {
        const entry: DialogEntry<QuestionsBottomSheetProps> = {
            id: "question-list",
            component: QuestionsBottomSheet,
            props: {
                store: store,
                onClickQuestion(vm) {
                    dialogmanager.closeById("question-list");
                    scrollToQuestion(vm);
                },
                onClickClose() {
                    dialogmanager.closeById("question-list");
                },
            }
        };
        dialogmanager.show(entry);
    };

    const openInfo = () => {
        const entry: DialogEntry<FormDetailBottomSheetProps> = {
            id: "form-detail",
            component: FormDetailBottomSheet,
            props: {
                store: store,
                onClickClose() {
                    dialogmanager.closeById("form-detail");
                },
            }
        }
        dialogmanager.show(entry);
    };

    return (
        <div className={styles.mobileFooter}>
            <div className="flex gap-2">
                <Button variant="outline" shadow="none" color="secondary" onClick={openQuestionList}>
                    Questions
                </Button>
                <Button variant="outline" shadow="none" color="secondary" onClick={openInfo}>
                    <Info size={16} />
                </Button>
            </div>
            <Observer>
                {() => <Button loading={store.submitState.isLoading} disabled={store.submitState.isLoading} onClick={() => store.onClickSubmitButton()}>
                    Submit
                </Button>}
            </Observer>
        </div>
    );
}
