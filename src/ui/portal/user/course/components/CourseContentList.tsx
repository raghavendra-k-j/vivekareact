import { useCourseDetailStore } from "../CourseDetailContext";
import { FileText, CheckCircle, PlayCircle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardBody } from "~/ui/components/card";
import { useState } from "react";

type ContentItem = {
    id: number;
    title: string;
    type: 'video' | 'lesson' | 'assessment';
    completed: boolean;
    duration: string;
};

type Section = {
    title: string;
    items: ContentItem[];
};

export function CourseContentList() {
    const store = useCourseDetailStore();
    const detail = store.courseVm;
    const [openSections, setOpenSections] = useState<Set<string>>(new Set());

    if (!detail) return null;

    // Mock data - in real app this would come from the contents store
    const sections: Section[] = [
        {
            title: "Section 1: Introduction to React",
            items: [
                { id: 1, title: "Welcome to the Course", type: "video", completed: true, duration: "5 min" },
                { id: 2, title: "Core Concepts", type: "lesson", completed: true, duration: "20 min" },
                { id: 3, title: "Setup Your Environment", type: "lesson", completed: true, duration: "15 min" },
            ]
        },
        {
            title: "Section 2: Components & Props",
            items: [
                { id: 4, title: "Understanding Components", type: "video", completed: true, duration: "18 min" },
                { id: 5, title: "Passing Data with Props", type: "lesson", completed: false, duration: "22 min" },
                { id: 6, title: "Component Quiz", type: "assessment", completed: false, duration: "10 min" },
            ]
        },
        {
            title: "Section 3: State & Lifecycle",
            items: [
                { id: 7, title: "Introduction to State", type: "video", completed: false, duration: "15 min" },
                { id: 8, title: "Lifecycle Methods", type: "lesson", completed: false, duration: "25 min" },
            ]
        }
    ];

    const toggleSection = (title: string) => {
        setOpenSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(title)) {
                newSet.delete(title);
            } else {
                newSet.add(title);
            }
            return newSet;
        });
    };

    const getItemIcon = (type: ContentItem['type']) => {
        switch (type) {
            case 'video':
                return <PlayCircle size={18} className="text-blue-600" />;
            case 'lesson':
                return <FileText size={18} className="text-emerald-600" />;
            case 'assessment':
                return <BookOpen size={18} className="text-purple-600" />;
        }
    };

    return (
        <Card className="border border-default shadow-sm bg-white">
            <CardBody className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
                <div className="space-y-3">
                    {sections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                            <button
                                onClick={() => toggleSection(section.title)}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <h3 className="font-semibold text-gray-800">{section.title}</h3>
                                {openSections.has(section.title) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>

                            {openSections.has(section.title) && (
                                <div className="border-t border-gray-200">
                                    {section.items.map(item => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer">
                                            <div className="flex-shrink-0">
                                                {item.completed ? (
                                                    <CheckCircle size={20} className="text-emerald-500" />
                                                ) : (
                                                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                                                )}
                                            </div>
                                            <div className="flex-shrink-0">
                                                {getItemIcon(item.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`font-medium text-sm ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                    {item.title}
                                                </p>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {item.duration}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
}