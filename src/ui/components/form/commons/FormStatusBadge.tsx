import React from "react";
import { FormType } from "~/domain/forms/models/FormType";
import { Badge } from "~/ui/widgets/badges/Badge";

type FormTypeBadgeProps = {
    type: FormType;
    className?: string;
};

export const AssmntTypeBadge: React.FC<FormTypeBadgeProps> = ({ type, className }) => {
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