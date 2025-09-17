import { ArrowLeft } from "lucide-react";
import { IconButton } from "~/ui/widgets/button/IconButton";

export function BackButtonIcon({ onClick }: { onClick?: () => void }) {
    return (
        <IconButton
            variant="ghost"
            color="secondary"
            icon={<ArrowLeft className="w-5 h-5 text-default" />}
            onClick={onClick}
        />
    );
}