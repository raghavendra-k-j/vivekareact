import clsx from "clsx";
import React from "react";
import { UserFormStatus } from "~/domain/forms/models/UserFormStatus";
import { Badge, BadgeSize } from "~/ui/widgets/badges/Badge";

type Props = {
    status: UserFormStatus;
    size?: BadgeSize;
    className?: string;
};

export const UserStatusBadge: React.FC<Props> = ({ status, size = "sm", className }) => {
    const getStatusColor = (status: UserFormStatus) => {
        switch (status) {
            case UserFormStatus.Upcoming:
                return "blue";
            case UserFormStatus.Pending:
                return "amber";
            case UserFormStatus.Submitted:
                return "green";
            default:
                return "gray";
        }
    };

    return (
        <Badge
            variant="soft"
            color={getStatusColor(status)}
            size={size}
            className={className}
        >
            {status.name}
        </Badge>
    );
};