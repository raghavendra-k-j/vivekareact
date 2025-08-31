import * as React from "react";
import { FileUploadView } from "./FileUploadView";
import { PasteTextView } from "./PasteTextView";
import SegmentedButton from "~/ui/components/buttons/SegmentedButton";

export default function InputSourceStepView() {
    const [tab, setTab] = React.useState<"file" | "paste">("file");

    return (
        <div>
            {/* Segmented buttons row */}
            <div className="flex justify-center">
                <SegmentedButton
                    options={[
                        { value: "file", label: <span className="font-semibold">File Upload</span> },
                        { value: "paste", label: <span className="font-semibold">Paste Content</span> },
                    ]}
                    value={tab}
                    onChange={(v) => setTab(v as "file" | "paste")}
                    size="md"
                    className="shadow-sm"
                />
            </div>

            {/* Panels */}
            <div className="mt-4 w-full flex justify-center">
                {tab === "file" ? <FileUploadView /> : <PasteTextView />}
            </div>
        </div>
    );
}
