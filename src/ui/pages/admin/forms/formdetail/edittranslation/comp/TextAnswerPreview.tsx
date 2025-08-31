export type TextAnswerPreviewProps = {
    answer: string;
    label: string;
}

export function TextAnswerPreview({ answer, label }: TextAnswerPreviewProps) {
    return (<div className="text-base-m bg-slate-50 rounded-sm px-3 py-2">
        <div className="text-emerald-700 font-semibold">{label}</div>
        <div
            className="text-default"
            dangerouslySetInnerHTML={{
                __html: answer,
            }}
        />
    </div>);
}