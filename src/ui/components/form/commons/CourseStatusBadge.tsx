import React from "react";
import { CourseStatus } from "~/domain/lms/models/CourseStatus";
import { Badge } from "~/ui/widgets/badges/Badge";

type Props = {
    status: CourseStatus;
    className?: string;
};

export function getCourseStatusBadgeColor(
    status: CourseStatus
): "green" | "blue" | "gray" {
    switch (status.value) {
        case CourseStatus.ACTIVE.value:
            return "green";
        case CourseStatus.COMPLETED.value:
            return "blue";
        default:
            return "gray";
    }
}


export const CourseStatusBadge: React.FC<Props> = ({ status: status, className }) => {
    return (
        <Badge
            variant="soft"
            color={getCourseStatusBadgeColor(status)}
            className={className}
        >
            {status.label}
        </Badge>
    );
};