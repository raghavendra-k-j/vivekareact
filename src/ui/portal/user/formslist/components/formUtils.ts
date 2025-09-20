export const getScoreColor = ({ passingMarks, gainedMarks }: { passingMarks: number | null; gainedMarks: number | null }) => {
    if (passingMarks === null || gainedMarks === null) return "text-default";
    if (gainedMarks >= passingMarks) return "text-emerald-600";
    return "text-red-600";
};