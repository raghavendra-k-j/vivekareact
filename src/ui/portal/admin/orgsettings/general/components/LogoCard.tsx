import { Observer } from "mobx-react-lite";
import { useRef } from "react";
import { Cropper, CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { FileSizeFmt } from "~/core/utils/FileSizeFmt";
import { ServiceUrl } from "~/infra/datasources/ServiceUrl";
import Card, { CardBody } from "~/ui/components/card";
import { Button } from "~/ui/widgets/button/Button";
import { SettingsCardHeader } from "../../components/OrgSettingsHeader";
import { useGeneralSettingsStore } from "../GeneralSettingsContext";

export function LogoCard() {
    const store = useGeneralSettingsStore();

    return (
        <Card>
            <SettingsCardHeader title="Organization Logo" />
            <CardBody className="p-6">
                <Observer>{() => (!store.selectedFile ? <LogoPreview /> : <LogoCropper />)}</Observer>
            </CardBody>
        </Card>
    );
}

function LogoPreview() {
    return (
        <Observer>
            {() => {
                const store = useGeneralSettingsStore();
                return store.orgSettings.logoUrl ? <HasLogoView /> : <NoLogoView />;
            }}
        </Observer>
    );
}

function NoLogoView() {
    const store = useGeneralSettingsStore();
    const allowedExtensions = store.orgSettings.validationData.logoAllowedExtensions || [];
    const maxFileSizeMB = FileSizeFmt.humanReadable(store.orgSettings.validationData.logoMaxSizeInBytes);
    const formats = allowedExtensions.map((e) => e.toUpperCase()).join(", ");

    return (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 px-4 py-3" onClick={() => store.onClickChooseFile()}>
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <div className="text-base font-medium text-default truncate">No logo uploaded</div>
                    <div className="text-sm text-secondary mt-1 truncate">
                        Accepted formats: {formats}. File size up to {maxFileSizeMB}.
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <Button onClick={(e) => {
                        e.stopPropagation();
                        return store.onClickChooseFile();
                    }} variant="solid" color="primary">
                        Choose file
                    </Button>
                </div>
            </div>
        </div>
    );
}

function HasLogoView() {
    const store = useGeneralSettingsStore();
    const allowedExtensions = store.orgSettings.validationData.logoAllowedExtensions || [];
    const maxFileSizeMB = FileSizeFmt.humanReadable(store.orgSettings.validationData.logoMaxSizeInBytes);
    const formats = allowedExtensions.map((e) => e.toUpperCase()).join(", ");
    const logoSrc = ServiceUrl.getUrl("/" + store.orgSettings.logoUrl);

    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <div className="w-40 h-24 bg-white flex items-center justify-center">
                    <img src={logoSrc} alt={store.orgSettings.orgName} className="object-contain max-w-full max-h-full" />
                </div>
            </div>

            <div className="flex flex-col items-center gap-3">
                <div className="flex items-center gap-3">
                    <Button onClick={() => store.onClickChooseFile()} variant="outline" color="primary">
                        Change logo
                    </Button>
                    <Button onClick={() => store.removeLogo()} variant="outline" color="danger">
                        Remove
                    </Button>
                </div>

                <div className="text-sm text-secondary text-center">
                    Accepted formats: {formats}. File size up to {maxFileSizeMB}.
                </div>
            </div>
        </div>
    );
}

function LogoCropper() {
    const store = useGeneralSettingsStore();
    const cropperRef = useRef<CropperRef | null>(null);

    const onUploadClick = async () => {
        const canvas = cropperRef.current?.getCanvas();
        if (canvas) {
            await store.uploadCroppedFromCanvas(canvas);
        }
    };

    return (
        <Observer>
            {() => (
                <div className="space-y-4">
                    <div className="border border-default shadow-sm">
                        <Cropper
                            ref={cropperRef as any}
                            src={store.previewUrl!}
                            className="w-full h-64"
                            stencilProps={{ handlers: true }}
                        />
                    </div>

                    <div className="flex gap-3 mt-3 justify-end">
                        <Button variant="ghost" onClick={() => store.clearSelectedFile()}>
                            Cancel
                        </Button>
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={onUploadClick}
                            disabled={store.saveLogoSatete.isLoading}
                        >
                            {store.saveLogoSatete.isLoading ? "Uploading..." : "Upload"}
                        </Button>
                    </div>
                </div>
            )}
        </Observer>
    );
}