import { Observer } from "mobx-react-lite";
import { useInteractionStore } from "../InteractionContext";
import styles from "./../styles.module.css";
import { scrollToQuestion } from "../utils/questionScrollUtil";
import { QIndexPanel } from "./QIndexPanel";
import { Button } from "~/ui/widgets/button/Button";


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
                    <Button
                        className="w-full"
                        loading={store.submitState.isLoading}
                        disabled={store.submitState.isLoading}
                        onClick={() => store.onClickSubmitButton()}>
                        Submit {store.formType.name}
                    </Button>
                );
            }}
        </Observer>
    );
};
