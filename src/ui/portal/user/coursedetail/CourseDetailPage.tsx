import { useMemo, useState } from "react";
import { Outlet } from "react-router";
import { CourseDetailContext } from "./CourseDetailContext";
import { CourseDetailStore } from "./CourseDetailStore";
import CourseContentsPage from "./contents/CourseContentsPage";
import CourseReportsPage from "./reports/CourseReportsPage";
import { CourseAvatar } from "~/ui/portal/components/avatar/CourseAvatar";
import { PortalAppBarLogo } from "~/ui/portal/components/appbar/PortalAppBarLogo";

function CourseDetailPageProvider({ children }: { children: React.ReactNode }) {
    const store = useMemo(() => new CourseDetailStore({}), []);

    return (
        <CourseDetailContext.Provider value={store}>
            {children}
        </CourseDetailContext.Provider>
    );
}

// Dummy course data
const courseData = {
    name: "Advanced Mathematics",
    description: "Master advanced mathematical concepts including algebra, geometry, trigonometry, and calculus",
    teachers: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Lisa Wang"],
    bgColor: "#3B82F6"
};

// Course Header following HomeAppBar pattern with branding logo
function CourseHeaderView() {
    return (
        <header className="bg-surface border-b border-default">
            <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center gap-4">
                {/* Organization Branding Logo - Same as HomeAppBar */}
                <div className="flex items-center gap-2">
                    <PortalAppBarLogo />
                </div>
                
                {/* Course Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <CourseAvatar name={courseData.name} color={courseData.bgColor} className="w-8 h-8 sm:w-10 sm:h-10" />
                    <div className="flex-1 min-w-0">
                        <h1 className="text-base sm:text-lg font-semibold text-default truncate">
                            {courseData.name}
                        </h1>
                        <div className="flex flex-wrap gap-1 sm:gap-2 mt-0.5">
                            {courseData.teachers.slice(0, 2).map((teacher, index) => (
                                <span key={index} className="text-xs text-tertiary bg-gray-50 px-1.5 py-0.5 rounded text-nowrap">
                                    {teacher}
                                </span>
                            ))}
                            {courseData.teachers.length > 2 && (
                                <span className="text-xs text-tertiary bg-gray-50 px-1.5 py-0.5 rounded">
                                    +{courseData.teachers.length - 2} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

function MobileTabNavigation({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) {
    const tabs = [
        { id: 'contents', label: 'Assessments' },
        { id: 'reports', label: 'Reports' }
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6">
            <div className="flex overflow-x-auto scrollbar-none">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`relative flex items-center justify-center h-12 px-4 font-medium transition-colors flex-shrink-0 ${
                            activeTab === tab.id 
                                ? 'text-primary bg-primary/5 border-b-2 border-primary' 
                                : 'text-tertiary hover:text-default hover:bg-gray-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function CourseDetailInner() {
    const [activeTab, setActiveTab] = useState('contents');

    return (
        <div className="min-h-screen bg-surface">
            <CourseHeaderView />
            
            {/* Mobile Tab Navigation */}
            <div className="lg:hidden border-b border-default">
                <MobileTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            
            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Contents Section */}
                    <div className="lg:col-span-7">
                        <div className="hidden lg:block mb-4">
                            <h2 className="text-lg font-semibold text-default">Course Assessments</h2>
                            <p className="text-sm text-tertiary">Complete assessments to track your progress</p>
                        </div>
                        
                        <div className={`${activeTab === 'contents' ? 'block' : 'hidden'} lg:block`}>
                            <CourseContentsPage />
                        </div>
                    </div>
                    
                    {/* Reports Section */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="hidden lg:block mb-4">
                            <h2 className="text-lg font-semibold text-default">Performance Reports</h2>
                            <p className="text-sm text-tertiary">View your progress and performance analytics</p>
                        </div>
                        
                        <div className={`${activeTab === 'reports' ? 'block' : 'hidden'} lg:block`}>
                            <CourseReportsPage />
                        </div>
                    </div>
                </div>
            </div>
            
            <Outlet />
        </div>
    );
}

export default function CourseDetailPage() {
    return (
        <CourseDetailPageProvider>
            <CourseDetailInner />
        </CourseDetailPageProvider>
    );
}