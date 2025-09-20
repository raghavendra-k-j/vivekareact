import clsx from "clsx";
import { LayoutGroup, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { useEnableDragScroll } from "~/ui/hooks/useEnableDragScroll";
import styles from "./CourseNavigation.module.css";

export function CourseNavigation({ activeTab, onTabChange }: { activeTab?: string; onTabChange?: (tab: string) => void } = {}) {
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    useEnableDragScroll(scrollRef);

    const handleBackClick = () => {
        navigate(-1); // Go back to previous page (typically home)
    };

    // Only show tabs if both props are provided
    const showTabs = activeTab && onTabChange;
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'contents', label: 'Contents' }
    ];

    return (
        <div className={styles.navigationContainer}>
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    {/* Back Button */}
                    <button 
                        onClick={handleBackClick}
                        className={styles.backButton}
                        title="Back to courses"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    {/* Tab Navigation - Only show if tabs are enabled */}
                    {showTabs && (
                        <LayoutGroup id="course-nav">
                            <div className="flex overflow-x-auto scrollbar-none" ref={scrollRef}>
                                {tabs.map((tab) => (
                                    <NavItemView 
                                        key={tab.id} 
                                        tab={tab} 
                                        isActive={activeTab === tab.id}
                                        onClick={() => onTabChange(tab.id)}
                                        className={styles.navItem} 
                                    />
                                ))}
                            </div>
                        </LayoutGroup>
                    )}
                </div>
            </div>
        </div>
    );
}

function NavItemView({ 
    tab, 
    isActive, 
    onClick, 
    className 
}: { 
    tab: { id: string; label: string }; 
    isActive: boolean; 
    onClick: () => void; 
    className?: string;
}) {
    return (
        <button
            onClick={onClick}
            className={clsx(className, isActive ? styles.active : styles.inactive)}
        >
            <span>{tab.label}</span>
            {isActive && (
                <motion.span layoutId="course-nav-underline" className={styles.underline} />
            )}
        </button>
    );
}