import { Observer } from "mobx-react-lite";
import { useInteractionStore } from "../InteractionContext";
import FilledButton from "~/ui/widgets/button/FilledButton";
import styles from "./../styles.module.css";
import { scrollToQuestion } from "../utils/questionScrollUtil";
import { QIndexPanel } from "./QIndexPanel";


export function RightSidebar() {
    return (
        <div className={styles.rightPanel}>
            <QIndexPanel onClickQuestion={scrollToQuestion} />
            <QuestionPanelFooter />
        </div>
    );
}




const QuestionPanelFooter = () => {
    const store = useInteractionStore();
    return (
        <Observer>
            {() => {
                return (
                    <FilledButton
                        className="w-full"
                        isLoading={store.submitState.isLoading}
                        disabled={store.submitState.isLoading}
                        onClick={() => store.onClickSubmitButton()}>
                        Submit {store.formType.name}
                    </FilledButton>
                );
            }}
        </Observer>
    );
};
