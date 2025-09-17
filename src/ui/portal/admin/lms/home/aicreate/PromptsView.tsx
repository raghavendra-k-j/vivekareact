import { useState } from 'react';
import { Observer } from "mobx-react-lite";
import { School, GraduationCap, BookOpen, Building2, LucideIcon } from 'lucide-react';

interface PromptTemplate {
    title: string;
    prompt: string;
}

interface Category {
    id: string;
    name: string;
    icon: LucideIcon;
    items: PromptTemplate[];
}

interface CategoryButtonProps {
    category: Category;
    isSelected: boolean;
    onClick: () => void;
}


function CategoryButton({ category, isSelected, onClick }: CategoryButtonProps) {
    const IconComponent = category.icon;

    return (
        <button
            onClick={onClick}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isSelected
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface text-secondary border border-default/30 hover:border-primary/30 hover:text-strong hover:shadow-sm'
                }`}
        >
            <IconComponent size={16} />
            <span>{category.name}</span>
        </button>
    );
}

function PromptCard({ prompt, onClick }: { prompt: PromptTemplate; onClick: () => void; }) {
    return (
        <button
            onClick={onClick}
            className="text-left p-3 rounded-xl border transition-all duration-200 group h-full bg-gray-50 border-default shadow-sm hover:shadow-md"
        >
            <div className="font-medium text-sm text-strong mb-1 group-hover:text-primary transition-colors">
                {prompt.title}
            </div>
            <div className="text-xs text-secondary line-clamp-2 leading-relaxed">
                {prompt.prompt}
            </div>
        </button>
    );
}

export function PromptsView({ onPromptSelected }: { onPromptSelected: (prompt: string) => void }) {
    const categories: Category[] = [
        {
            id: 'schools',
            name: 'Schools',
            icon: School,
            items: [
                {
                    title: "School Structure 2024",
                    prompt: "Create folder 2024 with sub folder class 1 to class 10 and each class from 1 to 4 having subjects - Kannada, English, Hindi, EVS and from 4 to 10 having subjects Kannada, English, Hindi, Science, Social, Mathematics"
                },
                {
                    title: "Primary School Curriculum",
                    prompt: "Create a primary school structure with classes Nursery to Grade 5, each having subjects: English, Mathematics, Science, Social Studies, Art, Music, Physical Education, and Computer Basics"
                },
                {
                    title: "High School Subjects",
                    prompt: "Create folders for high school grades 9-12 with subjects: Physics, Chemistry, Biology, Mathematics, English, History, Geography, Economics, Computer Science, and Physical Education"
                },
                {
                    title: "CBSE Board Structure",
                    prompt: "Create CBSE curriculum structure with classes 1-12, including all main subjects, practical labs, project work, and assessment folders for each grade"
                }
            ]
        },
        {
            id: 'university',
            name: 'University',
            icon: GraduationCap,
            items: [
                {
                    title: "University Course Structure",
                    prompt: "Create a Computer Science department with folders for each semester (1-8) and subjects like Data Structures, Algorithms, Database Management, Web Development, Machine Learning, and include labs and projects folders"
                },
                {
                    title: "Engineering Curriculum",
                    prompt: "Create an engineering college structure with departments: Mechanical, Electrical, Civil, Computer Science, each with 8 semesters, labs, workshops, and project folders"
                },
                {
                    title: "Medical Curriculum",
                    prompt: "Create a medical curriculum with folders for each year (1-4) and subjects like Anatomy, Physiology, Biochemistry, Pathology, Pharmacology, and include clinical rotations and research folders"
                },
                {
                    title: "Business Administration",
                    prompt: "Create MBA program structure with semesters 1-4, subjects like Marketing, Finance, HR, Operations, Strategy, and include case studies, projects, and internship folders"
                }
            ]
        },
        {
            id: 'tuition',
            name: 'Tuition',
            icon: BookOpen,
            items: [
                {
                    title: "Competitive Exam Coaching",
                    prompt: "Create coaching center structure for JEE/NEET preparation with subjects: Physics, Chemistry, Mathematics, Biology, mock tests, study materials, and doubt clearing sessions"
                },
                {
                    title: "Language Learning Center",
                    prompt: "Create a language learning center with courses for English, French, German, Spanish, each with Beginner, Intermediate, Advanced levels and conversation practice folders"
                },
                {
                    title: "Skill Development Center",
                    prompt: "Create skill development courses for Coding, Digital Marketing, Graphic Design, Data Science, each with theory, practical projects, and certification folders"
                },
                {
                    title: "Tuition Classes Structure",
                    prompt: "Create tuition center with classes 6-12, subjects: Mathematics, Science, English, Social Studies, and include test papers, homework, and progress reports"
                }
            ]
        },
        {
            id: 'corporate',
            name: 'Corporate',
            icon: Building2,
            items: [
                {
                    title: "Employee Training Program",
                    prompt: "Create corporate training structure with departments: HR, IT, Sales, Marketing, each with onboarding, skill development, compliance training, and certification folders"
                },
                {
                    title: "Project Management Office",
                    prompt: "Create PMO structure with project templates, documentation standards, risk management, quality assurance, and project tracking folders"
                },
                {
                    title: "Product Development",
                    prompt: "Create product development structure with phases: Planning, Design, Development, Testing, Deployment, and include requirements, code, testing, and documentation folders"
                },
                {
                    title: "IT Infrastructure",
                    prompt: "Create IT department structure with network management, server administration, security, help desk, software licenses, and backup systems folders"
                }
            ]
        }
    ];

    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    const handlePromptSelect = (prompt: string) => {
        onPromptSelected(prompt);
    };

    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
    const filteredPrompts = selectedCategoryData?.items || [];

    return (
        <Observer>
            {() => (
                <div className={`space-y-6`}>

                    {/* Header Part */}
                    <div className="text-center max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold text-strong mb-2">
                            Create Your LMS Hierarchy with AI
                        </h3>
                        <p className="text-secondary text-sm">
                            Create new folders and empty courses for your organization quickly. Describe how you want them named and arranged, or pick a sample template below, and we’ll generate the hierarchy for you.
                        </p>
                    </div>


                    {/* Categories Button*/}
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <CategoryButton
                                key={category.id}
                                category={category}
                                isSelected={selectedCategory === category.id}
                                onClick={() => handleCategorySelect(category.id)}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPrompts.map((sample, index) => (
                            <PromptCard
                                key={index}
                                prompt={sample}
                                onClick={() => handlePromptSelect(sample.prompt)}
                            />
                        ))}
                    </div>

                    <div className="min-h-16"></div>

                </div>
            )}
        </Observer>
    );
}