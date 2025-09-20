import { QMediaTile } from "~/domain/forms/models/qmedia/QMediaTile";
import { ServiceUrl } from "~/infra/datasources/ServiceUrl";

export type QuestionVideoViewProps = {
    media: QMediaTile;
}


export function QuestionVideoView(props: QuestionVideoViewProps) {
    return (
        <video
            className="w-full h-full object-cover rounded-sm"
            controls
            src={ServiceUrl.getBaseUrl() + "/" + props.media.path}
        >
            Your browser does not support the video tag.
        </video>
    );
}

