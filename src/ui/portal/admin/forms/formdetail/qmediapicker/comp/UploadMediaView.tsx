import { Upload } from "lucide-react";
import { Observer } from "mobx-react-lite";
import { FileSizeFmt } from "~/core/utils/FileSizeFmt";
import { QMediaExtension } from "~/domain/forms/models/qmedia/QMediaExtension";
import { Button } from "~/ui/widgets/button/Button";
import { useQMediaPickerStore } from "../QMediaPickerContext";

export function UploadMediaView() {
    const store = useQMediaPickerStore();
    const imageExtensions = [
        QMediaExtension.extensionJpeg,
        QMediaExtension.extensionJpg,
        QMediaExtension.extensionPng,
    ];

    const videoExtensions = [
        QMediaExtension.extensionMp4,
    ];

    const maxAllowedImageSize = store.maxAllowedImageSize;
    const maxAllowedVideoSize = store.maxAllowedVideoSize;

    return (
        <div className="text-center p-6 overflow-auto">
            <div className="text-primary p-4 flex justify-center">
                <div className="bg-primary-50 rounded-full p-4"><Upload size={48} /></div>
            </div>
            <div className="flex gap-2 flex-col items-center">
                <h2 className="text-lg font-semibold text-default">Upload an Image or Video</h2>
                <p className="text-sm text-secondary">
                    Accepted formats: {imageExtensions.map(ext => `${ext}`).join(", ")} (up to {FileSizeFmt.humanReadable(maxAllowedImageSize)}), {videoExtensions.map(ext => `.${ext}`).join(", ")} (up to {FileSizeFmt.humanReadable(maxAllowedVideoSize)}).
                </p>
                <Observer>
                    {() => {
                        return (
                            <Button loading={store.uploadState.isLoading} disabled={store.isUploadButtonDisabled} onClick={() => store.openFilePicker()} className="mt-4">
                                {store.uploadState.isLoading ? "Uploading..." : "Select File"}
                            </Button>
                        );
                    }}
                </Observer>
            </div>
        </div>
    );
}