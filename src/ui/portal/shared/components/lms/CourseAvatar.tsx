import clsx from "clsx";
import { ReactNode } from "react";
import { AvatarColor } from "~/domain/common/models/AvatarColor";

export function CourseAvatar({
    avatarColor,
    name,
    className,
    sizeClassName = "w-4 h-4",
    textSizeClassName = "text-sm",
    isLoading = false
}: {
    avatarColor?: AvatarColor,
    name?: string,
    className?: string,
    sizeClassName?: string,
    textSizeClassName?: string,
    isLoading?: boolean
}): ReactNode {
    const baseClasses = clsx(className, sizeClassName, "flex items-center justify-center rounded-full select-none");

    if (isLoading) {
        return (
            <div
                className={clsx(baseClasses, "bg-gray-300 animate-pulse")}
            />
        );
    }

    if (!avatarColor || !name) {
        return null;
    }

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div
            className={clsx(baseClasses, textSizeClassName)}
            style={{ backgroundColor: avatarColor.bgColor, color: avatarColor.fgColor }}
        >
            {initials}
        </div>
    );
}