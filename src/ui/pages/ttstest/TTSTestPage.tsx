import FilledButton from "~/ui/widgets/button/FilledButton";
import { TestQuestion } from "./models/TestQuestion";
import { useTTSTestPageStore } from "./TTSTestPageContext";
import { TTSTestPageProvider } from "./TTSTestPageProvider";
import { Observer } from "mobx-react-lite";
import { useDialogManager } from "~/ui/widgets/dialogmanager";

export default function TTSTestPage() {
    return (<TTSTestPageProvider>
        <TTSTestPageInner />
    </TTSTestPageProvider>);
}

function TTSTestPageInner() {
    return (
        <div className="flex flex-col h-full overflow-hidden">
            <Header />
            <MainContent />
            <Footer />
        </div>
    );
}


function Header() {
    const store = useTTSTestPageStore();
    return (<div>
        <div>Header</div>
        <div className="p-4">{store.tts?.supportedLanguages.join(", ")}</div>
    </div>);
}

function Footer() {
    return (<div>Footer</div>);
}

function MainContent() {
    const store = useTTSTestPageStore();
    const dialogManager = useDialogManager();
    return (
        <div>
            <FilledButton onClick={() => store.openSTTDialog(dialogManager)}>Listen</FilledButton>
            <div className="flex-1 overflow-y-auto gap-2">
                {store.questions.map((q) => (<QuestionView key={q.id} question={q} />))}
            </div>
        </div>
    );
}


type QuestionViewProps = {
    question: TestQuestion;
}

function QuestionView(props: QuestionViewProps) {
    const { question } = props;
    return (<div className="bg-white flex gap-2 flex-col p-4 shadow-sm rounded-sm border border-default">
        {question.question}
        <SpeakButton question={question} />
    </div>);
}


type SpeakButtonProps = {
    question: TestQuestion;
}

function SpeakButton(props: SpeakButtonProps) {
    const store = useTTSTestPageStore();
    const question = props.question;
    return (
        <div>
            <Observer>
                {() => {
                    const isSpeaking = store.isSpeaking(question);
                    return (<FilledButton onClick={() => store.onClickSpeakButton(question)}>{isSpeaking ? "Stop" : "Speak"}</FilledButton>);
                }}
            </Observer>
        </div>
    );
}