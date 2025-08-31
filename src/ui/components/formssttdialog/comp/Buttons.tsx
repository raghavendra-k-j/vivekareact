import { Check, X } from "lucide-react";
import { IconButton } from "~/ui/widgets/button/IconButton";

type BaseButtonProps = {
    onClick: () => void;
};

export function DoneButton({ onClick }: BaseButtonProps) {
    return (
        <IconButton
            shape="circle"
            color="success"
            shadow="sm"
            variant="solid"
            icon={<Check size={16} />}
            onClick={onClick}
        >
            Done
        </IconButton>
    );
}

export function CancelButton({ onClick }: BaseButtonProps) {
    return (
        <IconButton
            shape="circle"
            color="danger"
            shadow="sm"
            variant="outline"
            icon={<X size={16} />}
            onClick={onClick}
        />
    );
}

type MicButtonProps = {
    onClick: () => void;
    iconClassName: string;
    buttonDisabled: boolean;
    Icon: React.ElementType;
};

export function MicButton({ onClick, iconClassName, buttonDisabled, Icon }: MicButtonProps) {
    return (
        <button
            className={iconClassName}
            onClick={onClick}
            disabled={buttonDisabled}
            type="button"
        >
            <Icon size={24} />
        </button>
    );
}
