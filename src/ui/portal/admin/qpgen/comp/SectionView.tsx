import { useState } from "react";
import { Section } from "~/domain/qp/models/Section";
import { QuestionView } from "./QuestionItem";

export function SectionView({ section }: { section: Section, sectionIndex: number }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="border-b border-default w-full">
            {/* Section Header */}
            <div
                className="flex flex-col px-6 py-4 bg-surface select-none cursor-pointer"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                tabIndex={0}
                role="button"
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}
            >
                <div className="text-base font-semibold text-default">
                    {section.title}
                </div>
                <div className="flex gap-2 text-sm font-medium text-secondary mt-2">
                    <span>
                        {section.totalQuestions} Questions
                        <span>&nbsp;&middot;&nbsp;</span>
                        {section.totalMarks} Marks
                    </span>
                </div>
            </div>
            {open && (
                <div className="space-y-2 p-4">
                    {section.questions.map((question, index) => (
                        <QuestionView key={index} question={question} number={index + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

