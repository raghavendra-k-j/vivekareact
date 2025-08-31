import { useState } from "react";
import { Question } from "~/domain/qp/models/Question";
import MathContent from "./MathContent";

export function QuestionView({ question, number }: { question: Question, number: number }) {
    const [showAnswer, setShowAnswer] = useState(false);
    return (
        <div className="px-4 py-2">
            <div
                className="flex justify-between items-start cursor-pointer select-none"
                onClick={() => setShowAnswer((v) => !v)}
                aria-label={showAnswer ? 'Hide Answer' : 'Show Answer'}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setShowAnswer(v => !v); }}
            >
                <QuestionText question={question} number={number} />
            </div>
            {showAnswer && <AnswerText question={question} />}
        </div>
    );
}

function QuestionText({ question, number }: { question: Question, number: number }) {
    return (
        <div className="flex items-start gap-2">
            <span className="select-none pt-1">{number}.</span>
            <MathContent
                className="text-base text-default mb-1 leading-relaxed flex-1"
                content={question.question}
            />
        </div>
    );
}

function AnswerText({ question }: { question: Question }) {
    return (
        <div className="bg-slate-50 rounded-sm px-4 py-2 mt-2">
            <div className="text-sm font-semibold text-emerald-600">Answer</div>
            <MathContent
                className="text-base text-default"
                content={question.answer}
            />
        </div>
    );
}
