export const CourseAvatar = ({ name, color, className }: { name: string; color: string; className?: string }) => {
    return (
        <div
            className={`rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 ${className}`}
            style={{ backgroundColor: color }}
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
};
