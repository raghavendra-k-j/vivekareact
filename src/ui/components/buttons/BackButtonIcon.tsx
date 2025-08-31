import { ArrowLeft } from "lucide-react";
import { IconButton } from "~/ui/widgets/button/IconButton";

export function BackButtonIcon() {
    return (
        <IconButton
            variant="ghost"
            color="secondary"
            icon={<ArrowLeft className="w-5 h-5 text-default" />}
        />
    );
}