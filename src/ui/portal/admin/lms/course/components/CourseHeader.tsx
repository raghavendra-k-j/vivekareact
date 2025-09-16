import { ReactNode } from "react";
import { CardHeader } from "~/ui/components/card";

export function CourseCardHeader({ title }: { title: ReactNode }) {
    return (
        <CardHeader className="px-4 py-2 border-b border-default">
            <h3 className="text-primary font-semibold text-lg">{title}</h3>
        </CardHeader>
    );
}