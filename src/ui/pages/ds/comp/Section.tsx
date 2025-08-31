export type SectionProps = {
    title: string;
    content: React.ReactNode;
}

export function Section(props: SectionProps) {
    return (
        <div className="flex flex-col gap-2 bg-surface shadow-sm">
            <h2 className="font-bold text-default text-lg px-3 py-2 border-b border-default">{props.title}</h2>
            <div className="p-6">
                {props.content}
            </div>
        </div>
    );
}