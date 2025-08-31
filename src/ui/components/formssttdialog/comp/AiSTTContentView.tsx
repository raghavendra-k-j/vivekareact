import { X } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { Paragraph } from "~/domain/forms/stt/FormsSTTRes";
import { FormsSTTRes2Html } from "~/domain/forms/stt/FormsSTTRes2Html";
import { useFormsSTTDialogStore } from "../FormSTTDialogContext";

export function AiSTTContentView() {
    const store = useFormsSTTDialogStore();
    return store.isLaTex ? <LatextContentView /> : <ParagraphsContentView />;
}

function LatextContentView() {
    const store = useFormsSTTDialogStore();
    const handleRemove = () => {
        store.latexResVm.replace("");
    };
    return (
        <Observer>
            {() => {
                if (store.latexResVm.isEmpty) return null;
                const html = FormsSTTRes2Html.convertLaTex(store.latexResVm.latex);
                return (
                    <div className="text-base text-black space-y-1 relative">
                        <button
                            title="Delete LaTeX"
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-0 right-0 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded p-1"
                            aria-label="Delete LaTeX"
                        >
                            <X size={14} strokeWidth={2} />
                        </button>
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                );
            }}
        </Observer>
    );
}

function ParagraphText({ paragraph }: { paragraph: Paragraph }) {
    const html = FormsSTTRes2Html.convertParagraph(paragraph);
    return (
        <div
            dangerouslySetInnerHTML={{ __html: html }}
            className="whitespace-pre-wrap text-black text-sm"
        />
    );
}

function RemoveButton({ uuid }: { uuid: string }) {
    const store = useFormsSTTDialogStore();

    const handleRemove = () => {
        store.docResVm.removeById(uuid);
    };

    return (
        <button
            title="Delete"
            type="button"
            onClick={handleRemove}
            className="text-gray-500 hover:text-red-600 ml-2 hover:bg-gray-100 rounded p-1"
            aria-label="Delete"
        >
            <X size={14} strokeWidth={2} />
        </button>
    );
}

function ParagraphItem({ paragraph }: { paragraph: Paragraph }) {
    return (
        <div className="flex items-start text-black text-sm py-1">
            <div className="flex-1">
                <ParagraphText paragraph={paragraph} />
            </div>
            <RemoveButton uuid={paragraph.uuid} />
        </div>
    );
}

export function ParagraphsContentView() {
    const store = useFormsSTTDialogStore();

    return (
        <Observer>
            {() => {
                if (store.docResVm.isEmpty) return null;
                return (
                    <div className="text-black text-sm">
                        {store.docResVm.paragraphs.map((paragraph: Paragraph) => (
                            <ParagraphItem key={paragraph.uuid} paragraph={paragraph} />
                        ))}
                    </div>
                );
            }}
        </Observer>
    );
}
