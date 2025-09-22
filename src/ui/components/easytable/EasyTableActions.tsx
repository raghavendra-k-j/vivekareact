import { MoreVertical } from "lucide-react";
import { IconButton } from "~/ui/widgets/button/IconButton";
import { EasyDropDown, EasyDropDownContent, EasyDropDownItem, EasyDropDownTrigger } from "~/ui/widgets/easydropdown";

export interface EasyTableAction {
    key: string;
    label: string;
    icon?: React.ReactNode;
    variant?: "default" | "destructive";
    onClick: () => void;
    disabled?: boolean;
    hidden?: boolean;
}

export interface EasyTableActionsProps {
    actions: EasyTableAction[];
    className?: string;
}

export function EasyTableActions({
    actions,
    className
}: EasyTableActionsProps) {
    const visibleActions = actions.filter(action => !action.hidden);
    if (visibleActions.length === 0) {
        return null;
    }

    return (
        <div className={`flex justify-end ${className || ''}`}>
            <EasyDropDown>
                <EasyDropDownTrigger>
                    <IconButton
                        icon={<MoreVertical className="w-4 h-4" />}
                        size="sm"
                        variant="ghost"
                        color="secondary"
                    />
                </EasyDropDownTrigger>
                <EasyDropDownContent>
                    {visibleActions.map((action) => (
                        <EasyDropDownItem
                            key={action.key}
                            icon={action.icon}
                            onClick={(event) => {
                                event.stopPropagation();
                                action.onClick();
                            }}
                            variant={action.variant}
                            disabled={action.disabled}
                        >
                            {action.label}
                        </EasyDropDownItem>
                    ))}
                </EasyDropDownContent>
            </EasyDropDown>
        </div>
    );
}