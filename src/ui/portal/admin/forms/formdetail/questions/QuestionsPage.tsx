import { Button } from "~/ui/widgets/button/Button";
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
            <Button onClick={handleOnClickQuestion}>Add Questions</Button>
        </div>
    );
}