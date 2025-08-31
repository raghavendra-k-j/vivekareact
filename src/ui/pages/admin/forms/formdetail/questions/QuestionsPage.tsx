import FilledButton from "~/ui/widgets/button/FilledButton";
import { QuestionPageProvider } from "./QuestionPageProvider";

export default function QuestionsPage() {
    return (<QuestionPageProvider>
        <Body />
    </QuestionPageProvider>);
}


function Body() {
    const handleOnClickQuestion = () => {
        
    };
    return (
        <div>
            <FilledButton onClick={handleOnClickQuestion}>Add Questions</FilledButton>
        </div>
    );
}