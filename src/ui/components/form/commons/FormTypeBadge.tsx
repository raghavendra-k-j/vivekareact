import React from "react";
import { FormType } from "~/domain/forms/models/FormType";
import { Badge, BadgeSize } from "~/ui/widgets/badges/Badge";

type Props = {
    type: FormType;
    size?: BadgeSize;
    className?: string;
};



export const FormTypeBade: React.FC<Props> = ({ type, size = "sm", className }) => {
    return (
        <Badge
            variant="soft"
            color={getBadgeColor(type)}
            size={size}
            className={className}
        >
            {type.name}
        </Badge>
    );
};

function getBadgeColor(type: FormType): "blue" | "orange" {
    if (type.isAssessment) return "blue";
    if (type.isSurvey) return "orange";
    return "blue";
}