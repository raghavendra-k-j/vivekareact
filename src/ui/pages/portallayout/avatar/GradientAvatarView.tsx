import clsx from "clsx";

export const avatarClasses = [
    "bg-gradient-to-br from-teal-400 to-teal-600",
    "bg-gradient-to-br from-blue-400 to-blue-600",
    "bg-gradient-to-br from-rose-400 to-rose-600",
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-green-400 to-green-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
    "bg-gradient-to-br from-orange-400 to-orange-600",
    "bg-gradient-to-br from-cyan-400 to-cyan-600",
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-lime-400 to-lime-600",
    "bg-gradient-to-br from-emerald-400 to-emerald-600",
    "bg-gradient-to-br from-fuchsia-400 to-fuchsia-600",
    "bg-gradient-to-br from-violet-400 to-violet-600",
    "bg-gradient-to-br from-yellow-400 to-yellow-600",
    "bg-gradient-to-br from-red-400 to-red-600",
];


export const GradientAvatarView = ({
    id,
    name,
    fontSize,
    className,
}: {
    id: number;
    name: string;
    fontSize?: number | string;
    className?: string;
}) => {
    const colorClass = avatarClasses[id % avatarClasses.length];
    return (
        <div
            className={clsx("text-white shrink-0 flex justify-center items-center", className, colorClass)}
            style={fontSize ? { fontSize } : undefined}
        >
            {name?.charAt(0) ?? ""}
        </div>
    );
};

