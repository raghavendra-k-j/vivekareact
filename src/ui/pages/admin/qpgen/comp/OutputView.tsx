import { useQPGenPageStore } from "../QPGenPageContext";
import { SectionView } from "./SectionView";

export function QPGenOutputDataView() {
    return (
        <CommonCard>
            <Header />
            <AIGeneratedWarning />
            <SectionsList />
        </CommonCard>
    );
}

export function CommonCard({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full flex flex-col bg-surface rounded-sm shadow-sm border border-default">
            {children}
        </div>
    );
}


function Header() {
    const { qp } = useQPGenPageStore();
    const totalMarks = qp.totalMarks;
    const totalQuestions = qp.totalQuestions;
    return (<div className="border-b border-default px-6 py-4">
        <div className="text-xl font-bold mb-2">{qp.title}</div>
        <div className="text-sm text-secondary">
            <span>
                {totalQuestions} Questions
                <span>&nbsp;&middot;&nbsp;</span>
                {totalMarks} Marks
            </span>
        </div>
    </div>);
}


function AIGeneratedWarning() {
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 px-4 py-2">
            <p>AI question paper generation feature is experimental. Please review all questions carefully.</p>
        </div>
    );
}


function SectionsList() {
    const { sections } = useQPGenPageStore();
    return (
        <div className="flex-1 overflow-y-auto border-t border-default">
            {sections.map((section, index) => (
                <SectionView key={index} section={section} sectionIndex={index} />
            ))}
        </div>
    );
}