import { QMediaTile } from "~/domain/forms/models/qmedia/QMediaTile";
import { ServiceUrl } from "~/infra/datasources/ServiceUrl";
import { Button } from "~/ui/widgets/button/Button";
import { FramedDialog } from "~/ui/widgets/dialogmanager";
import { DialogFooter } from "../../dialogs/DialogHeaderAndFooter";

export type QuestionMediaFullScreenProps = {
    media: QMediaTile;
    onClose: () => void;
};

export function QuestionMediaFullScreen({ media, onClose }: QuestionMediaFullScreenProps) {
    const type = media.type;
    return (
        <FramedDialog
            scaffoldClassName="p-6"
            contentClassName="w-full h-full max-w-2xl max-h-[700px] p-4 flex flex-col"
            onClose={onClose}>
            <div className="w-full h-full flex items-center justify-center">
                {type.isImage && (
                    <img
                        src={ServiceUrl.getBaseUrl() + "/" + media.path}
                        className="w-full h-full object-contain block"
                    />
                )}
                {type.isVideo && (
                    <video
                        className="w-full h-full object-contain block"
                        controls
                        src={ServiceUrl.getBaseUrl() + "/" + media.path}
                    >
                        Your browser does not support the video tag.
                    </video>
                )}
            </div>
            <DialogFooter
                actions={[
                    <Button variant="outline" color="secondary" key="close" onClick={onClose} className="w-full">
                        Close
                    </Button>
                ]}
            />
        </FramedDialog>
    );
}
