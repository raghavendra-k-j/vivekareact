import { FileText, ClipboardList, HelpCircle } from "lucide-react";
import { FormType } from "~/domain/forms/models/FormType";

interface FormAvatarProps {
    formType: FormType | null | undefined;
    className?: string;
}

export function FormAvatar({ formType, className = "" }: FormAvatarProps) {
    let icon;
    let bgColor;
    let ringColor;
    if (!formType) {
        icon = <HelpCircle className="w-4 h-4 text-gray-400" />;
        bgColor = "bg-gray-50";
        ringColor = "ring-gray-200/50";
    } else if (formType.isAssessment) {
        icon = <ClipboardList className="w-4 h-4 text-[var(--color-assessments-foreground)]" />;
        bgColor = "bg-[var(--color-assessments-bg)]";
        ringColor = "ring-[var(--color-assessments-ring)]/50";
    } else if (formType.isSurvey) {
        icon = <FileText className="w-4 h-4 text-[var(--color-surveys-foreground)]" />;
        bgColor = "bg-[var(--color-surveys-bg)]";
        ringColor = "ring-[var(--color-surveys-ring)]/50";
    }

    return (
        <div className={`flex items-center justify-center rounded-lg ring-1 ${bgColor} ${ringColor} ${className}`}>
            {icon}
        </div>
    );
}
