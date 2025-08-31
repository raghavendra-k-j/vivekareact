import { File } from "lucide-react";
import { InputSourceCard } from "./InputSourceCommon";
import { Button } from "~/ui/widgets/button/Button";

export function FileUploadView() {
    return (<InputSourceCard>
        <div className="p-6 w-full flex flex-col gap-6">
            <div className="bg-primary-50 border-dashed border-2 border-primary-200 rounded-sm">
                <div className="p-6 flex items-center justify-center">
                    <div className="p-6 bg-primary-100 rounded-full ">
                        <File className="w-10 h-10 text-primary-500" />
                    </div>
                </div>
            </div>
            <div>
                <div className="text-default font-semibold">Drag your files here or tab the "Choose File" button</div>
                <div className="text-secondary text-sm">
                    <div>Maxiumum File Size: 10MB</div>
                    <div>Allowed File Types: .jpg, .png, .pdf</div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <Button color="primary" className="w-full">Choose File</Button>
                <Button variant="outline" color="secondary" className="w-full">Browse Learning Resources</Button>
            </div>
        </div>
    </InputSourceCard>);
}

