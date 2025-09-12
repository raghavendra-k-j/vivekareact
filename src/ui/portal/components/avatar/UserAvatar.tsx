import clsx from "clsx";
import { GradientAvatarView } from "./GradientAvatarView";


export function UserAvatar({ sizeClass = "w-9 h-9", id, name, className }: { sizeClass?: string, id: number, name: string, className?: string }) {
    return (
        <div className={clsx(sizeClass, className)}>
            <GradientAvatarView
                className={clsx(sizeClass, "rounded-full font-bold shadow-sm")}
                id={id}
                fontSize={18}
                name={name}
            />
        </div>
    );
}

