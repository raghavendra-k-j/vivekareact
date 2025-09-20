import React from "react";
import { AdminFormStatus } from "~/domain/forms/models/AdminFormStatus";
import { Badge, BadgeSize } from "~/ui/widgets/badges/Badge";

type AdminFormStatusBadgeProps = {
    status: AdminFormStatus;
    size?: BadgeSize
    className?: string;
};

export const AdminFormStatusBadge: React.FC<AdminFormStatusBadgeProps> = ({ status, size = "sm", className }) => {
    return (
        <Badge
            variant="soft"
            size={size}
            color={getBadgeColor(status)}
            className={className}
        >
            {status.name}
        </Badge>
    );
};

function getBadgeColor(status: AdminFormStatus) {
    if (status.isDraft) return "warning";
    if (status.isPublished) return "info";
    if (status.isActive) return "success";
    if (status.isClosed) return "danger";
    if (status.isArchived) return "neutral";
    return "neutral";
}
