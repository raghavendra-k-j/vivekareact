import React from "react";
import { AssmntType } from "~/domain/forms/models/AssmntType";
import { Badge } from "~/ui/widgets/badges/Badge";

type AssmntTypeBadgeProps = {
    type: AssmntType;
    className?: string;
};

export const AssmntTypeBadge: React.FC<AssmntTypeBadgeProps> = ({ type, className }) => {
    return (
        <Badge
            variant="soft"
            color="indigo"
            className={className}
        >
            {type.name}
        </Badge>
    );
};