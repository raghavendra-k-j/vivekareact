import { useEffect, useMemo, useState } from "react";
import {
    Routes,
    Route,
    Link,
    useNavigate,
    useParams,
    useLocation,
} from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
    Menu,
    Bell,
    User,
    ChevronRight,
    ArrowLeft,
    FileBarChart2,
    ChartPie,
    BarChart3,
    LineChart,
} from "lucide-react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
    AreaChart,
    Area,
} from "recharts";

/********************
 * TypeScript Interfaces
 ********************/

interface AttemptBreakdown {
    attempted: number;
    correct: number;
    partial: number;
    incorrect: number;
    notAttempted: number;
}

interface MarksSummary {
    gained: number;
    negative: number;
    grandTotal: number;
}

interface Assessment {
    id: string;
    title: string;
    subject: string;
    courseId: string;
    totalQuestions: number;
    totalTimeMinutes: number;
    maxMarks: number;
    completed: boolean;
    percentage?: number;
    timeTakenMinutes?: number;
    attemptBreakdown?: AttemptBreakdown;
    marksSummary?: MarksSummary;
    perQuestionTime?: number[];
    scoreTimeline?: number[];
}

interface Survey {
    id: string;
    title: string;
    courseId: string;
    status: string;
    updatedAt: string;
}

interface Course {
    id: string;
    name: string;
    code: string;
    myAveragePercent: number;
    color: string;
}

interface TopicStat {
    topic: string;
    courseId: string;
    avgPercentage: number;
    assessmentsCount: number;
    maxMarks: number;
    gainedMarks: number;
}

interface CourseLeaderboardRow {
    rank: number;
    name: string;
    percentage: number;
    isMe: boolean;
}

interface CourseReport {
    courseId: string;
    averagePercent: number;
    topper: { name: string; percentage: number };
    leaderboard: {
        weekly: CourseLeaderboardRow[];
        monthly: CourseLeaderboardRow[];
        allTime: CourseLeaderboardRow[];
    };
}

interface LeaderboardRow {
    rank: number;
    name: string;
    percentage: number;
    isMe: boolean;
}

interface CategoryStat {
    category: string;
    avgPercentage: number;
    assessmentsCount: number;
}

interface Tab {
    key: string;
    label: string;
}

interface AppBarProps {
    schoolName?: string;
    onMenuClick: () => void;
    onNotificationsClick: () => void;
    userAvatarUrl?: string;
}

interface TabsBarProps {
    tabs: Tab[];
    activeTab: number;
    onChange: (index: number) => void;
}

interface BadgeProps {
    color?: "indigo" | "green" | "gray" | "yellow" | "red" | "blue";
    children: React.ReactNode;
}

interface AssessmentCardProps {
    item: Assessment;
}

interface SurveyCardProps {
    item: Survey;
}

interface CourseCardProps {
    course: Course;
}

interface CourseLeaderboardProps {
    report: CourseReport;
}

interface KpiCardProps {
    label: string;
    value: string | number;
    sub?: string;
}

interface HomeProps {
    activeTab: number;
    setActiveTab: (tab: number) => void;
}

interface BreakdownDonutProps {
    breakdown?: AttemptBreakdown;
}

interface TimePerQuestionBarProps {
    perQuestionTime?: number[];
}

interface ScoreTrendAreaProps {
    timeline?: number[];
}

interface EmptyStateProps {
    title: string;
    subtitle?: string;
}

/********************
 * Mock Data
 ********************/

/** @typedef {Object} Course */
const courses: Course[] = [
    { id: "c1", name: "Mathematics", code: "2024 • Class 10 • Section A • Math", myAveragePercent: 85, color: "from-blue-400 to-blue-600" },
    { id: "c2", name: "Physics", code: "2024 • Class 10 • Section A • Physics", myAveragePercent: 91, color: "from-purple-400 to-purple-600" },
    { id: "c3", name: "Chemistry", code: "2024 • Class 10 • Section A • Chemistry", myAveragePercent: 74, color: "from-green-400 to-green-600" },
    { id: "c4", name: "Biology", code: "2024 • Class 10 • Section A • Biology", myAveragePercent: 76, color: "from-teal-400 to-teal-600" },
    { id: "c5", name: "History", code: "2024 • Class 10 • Section A • History", myAveragePercent: 70, color: "from-amber-400 to-amber-600" },
    { id: "c6", name: "English", code: "2024 • Class 10 • Section A • English", myAveragePercent: 82, color: "from-rose-400 to-rose-600" },
];

/** @typedef {Object} TopicStat */
const topicStats: TopicStat[] = [
    // Mathematics topics
    { topic: "Algebra", courseId: "c1", avgPercentage: 88, assessmentsCount: 3, maxMarks: 150, gainedMarks: 132 },
    { topic: "Geometry", courseId: "c1", avgPercentage: 82, assessmentsCount: 2, maxMarks: 100, gainedMarks: 82 },
    { topic: "Trigonometry", courseId: "c1", avgPercentage: 85, assessmentsCount: 2, maxMarks: 80, gainedMarks: 68 },
    { topic: "Statistics", courseId: "c1", avgPercentage: 79, assessmentsCount: 1, maxMarks: 50, gainedMarks: 39 },
    
    // Physics topics
    { topic: "Mechanics", courseId: "c2", avgPercentage: 92, assessmentsCount: 2, maxMarks: 100, gainedMarks: 92 },
    { topic: "Thermodynamics", courseId: "c2", avgPercentage: 89, assessmentsCount: 1, maxMarks: 60, gainedMarks: 53 },
    { topic: "Optics", courseId: "c2", avgPercentage: 94, assessmentsCount: 1, maxMarks: 40, gainedMarks: 38 },
    { topic: "Electricity", courseId: "c2", avgPercentage: 87, assessmentsCount: 2, maxMarks: 80, gainedMarks: 70 },
    
    // Chemistry topics
    { topic: "Organic Chemistry", courseId: "c3", avgPercentage: 72, assessmentsCount: 2, maxMarks: 120, gainedMarks: 86 },
    { topic: "Inorganic Chemistry", courseId: "c3", avgPercentage: 76, assessmentsCount: 1, maxMarks: 80, gainedMarks: 61 },
    { topic: "Physical Chemistry", courseId: "c3", avgPercentage: 75, assessmentsCount: 1, maxMarks: 60, gainedMarks: 45 },
    
    // Biology topics
    { topic: "Cell Biology", courseId: "c4", avgPercentage: 78, assessmentsCount: 2, maxMarks: 100, gainedMarks: 78 },
    { topic: "Genetics", courseId: "c4", avgPercentage: 74, assessmentsCount: 1, maxMarks: 50, gainedMarks: 37 },
    { topic: "Ecology", courseId: "c4", avgPercentage: 76, assessmentsCount: 1, maxMarks: 60, gainedMarks: 46 },
    
    // History topics
    { topic: "Ancient History", courseId: "c5", avgPercentage: 72, assessmentsCount: 1, maxMarks: 40, gainedMarks: 29 },
    { topic: "Medieval History", courseId: "c5", avgPercentage: 68, assessmentsCount: 1, maxMarks: 50, gainedMarks: 34 },
    { topic: "Modern History", courseId: "c5", avgPercentage: 71, assessmentsCount: 1, maxMarks: 60, gainedMarks: 43 },
    
    // English topics
    { topic: "Literature", courseId: "c6", avgPercentage: 84, assessmentsCount: 2, maxMarks: 100, gainedMarks: 84 },
    { topic: "Grammar", courseId: "c6", avgPercentage: 80, assessmentsCount: 1, maxMarks: 50, gainedMarks: 40 },
    { topic: "Writing Skills", courseId: "c6", avgPercentage: 82, assessmentsCount: 1, maxMarks: 60, gainedMarks: 49 },
];

/** @typedef {Object} Assessment */
const assessments: Assessment[] = [
    {
        id: "a1",
        title: "Algebra Fundamentals Unit Test",
        subject: "Mathematics",
        courseId: "c1",
        totalQuestions: 20,
        totalTimeMinutes: 40,
        maxMarks: 100,
        completed: true,
        percentage: 82,
        timeTakenMinutes: 34,
        attemptBreakdown: {
            attempted: 19,
            correct: 14,
            partial: 3,
            incorrect: 2,
            notAttempted: 1,
        },
        marksSummary: {
            gained: 82,
            negative: -2,
            grandTotal: 80,
        },
        perQuestionTime: [30, 45, 52, 40, 60, 32, 28, 48, 50, 41, 33, 40, 39, 55, 36, 37, 44, 31, 42, 38],
        scoreTimeline: [5, 10, 15, 20, 25, 30, 34, 39, 44, 49, 54, 60, 64, 67, 70, 73, 76, 78, 80, 82],
    },
    {
        id: "a2",
        title: "Physics: Kinematics Quiz",
        subject: "Physics",
        courseId: "c2",
        totalQuestions: 15,
        totalTimeMinutes: 30,
        maxMarks: 60,
        completed: true,
        percentage: 91,
        timeTakenMinutes: 21,
        attemptBreakdown: {
            attempted: 15,
            correct: 13,
            partial: 1,
            incorrect: 1,
            notAttempted: 0,
        },
        marksSummary: { gained: 55, negative: -1, grandTotal: 54 },
        perQuestionTime: [22, 18, 20, 17, 15, 16, 24, 18, 19, 20, 21, 22, 18, 15, 17],
        scoreTimeline: [4, 8, 12, 16, 20, 24, 27, 31, 35, 39, 43, 47, 51, 55, 55],
    },
    {
        id: "a3",
        title: "Chemistry: Organic Basics",
        subject: "Chemistry",
        courseId: "c3",
        totalQuestions: 25,
        totalTimeMinutes: 45,
        maxMarks: 100,
        completed: false,
    },
    {
        id: "a4",
        title: "Biology: Cell Structure Assessment",
        subject: "Biology",
        courseId: "c4",
        totalQuestions: 18,
        totalTimeMinutes: 35,
        maxMarks: 80,
        completed: true,
        percentage: 76,
        timeTakenMinutes: 29,
        attemptBreakdown: {
            attempted: 17,
            correct: 12,
            partial: 2,
            incorrect: 3,
            notAttempted: 1,
        },
        marksSummary: { gained: 64, negative: -3, grandTotal: 61 },
        perQuestionTime: [25, 33, 40, 28, 36, 29, 31, 34, 30, 27, 32, 35, 36, 31, 29, 30, 28, 27],
        scoreTimeline: [3, 7, 11, 16, 20, 25, 30, 36, 41, 45, 49, 53, 56, 60, 62, 64, 64, 64],
    },
    {
        id: "a5",
        title: "Geometry Challenge",
        subject: "Mathematics",
        courseId: "c1",
        totalQuestions: 22,
        totalTimeMinutes: 40,
        maxMarks: 100,
        completed: false,
    },
    {
        id: "a6",
        title: "Trigonometry Practice Test",
        subject: "Mathematics",
        courseId: "c1",
        totalQuestions: 20,
        totalTimeMinutes: 40,
        maxMarks: 100,
        completed: true,
        percentage: 88,
        timeTakenMinutes: 33,
        attemptBreakdown: {
            attempted: 20,
            correct: 15,
            partial: 2,
            incorrect: 3,
            notAttempted: 0,
        },
        marksSummary: { gained: 88, negative: -5, grandTotal: 83 },
        perQuestionTime: [35, 34, 36, 29, 31, 28, 42, 41, 30, 32, 31, 29, 27, 33, 35, 36, 37, 38, 31, 29],
        scoreTimeline: [5, 10, 14, 20, 26, 31, 36, 41, 46, 51, 56, 60, 65, 70, 75, 79, 83, 86, 88, 88],
    },
    {
        id: "a7",
        title: "History: World Wars Quiz",
        subject: "History",
        courseId: "c5",
        totalQuestions: 12,
        totalTimeMinutes: 20,
        maxMarks: 50,
        completed: false,
    },
];

/** @typedef {Object} Survey */
const surveys: Survey[] = [
    { id: "s1", title: "Student Feedback — Term 1", courseId: "c1", status: "Open", updatedAt: "2025-08-28" },
    { id: "s2", title: "Library Services Survey", courseId: "c6", status: "Closed", updatedAt: "2025-06-12" },
    { id: "s3", title: "Cafeteria Satisfaction", courseId: "c6", status: "Completed", updatedAt: "2025-07-09" },
    { id: "s4", title: "Wellbeing & Safety Check", courseId: "c2", status: "Open", updatedAt: "2025-09-03" },
];

/** @typedef {Object} CourseReport */
const courseReports: CourseReport[] = [
    {
        courseId: "c1",
        averagePercent: 85,
        topper: { name: "Alice Johnson", percentage: 95 },
        leaderboard: {
            weekly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 6 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(60, Math.min(95, 92 - i * 2 + (i % 3) * 1)),
                isMe: i === 6,
            })),
            monthly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 8 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(58, Math.min(94, 90 - i * 1.8 + (i % 3) * 1.5)),
                isMe: i === 8,
            })),
            allTime: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 5 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(55, Math.min(96, 93 - i * 2.2 + (i % 3) * 2)),
                isMe: i === 5,
            })),
        },
    },
    {
        courseId: "c2",
        averagePercent: 88,
        topper: { name: "David Chen", percentage: 98 },
        leaderboard: {
            weekly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 4 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(65, Math.min(98, 95 - i * 2.2 + (i % 3) * 1)),
                isMe: i === 4,
            })),
            monthly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 3 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(63, Math.min(97, 94 - i * 2.1 + (i % 3) * 1.5)),
                isMe: i === 3,
            })),
            allTime: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 5 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(60, Math.min(98, 96 - i * 2.5 + (i % 3) * 2)),
                isMe: i === 5,
            })),
        },
    },
    {
        courseId: "c3",
        averagePercent: 74,
        topper: { name: "Emma Wilson", percentage: 89 },
        leaderboard: {
            weekly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 9 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(50, Math.min(89, 86 - i * 2.4 + (i % 3) * 1)),
                isMe: i === 9,
            })),
            monthly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 11 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(48, Math.min(87, 84 - i * 2.2 + (i % 3) * 1.5)),
                isMe: i === 11,
            })),
            allTime: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 10 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(45, Math.min(89, 85 - i * 2.6 + (i % 3) * 2)),
                isMe: i === 10,
            })),
        },
    },
    {
        courseId: "c4",
        averagePercent: 76,
        topper: { name: "Michael Brown", percentage: 92 },
        leaderboard: {
            weekly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 7 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(52, Math.min(92, 89 - i * 2.3 + (i % 3) * 1)),
                isMe: i === 7,
            })),
            monthly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 8 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(50, Math.min(90, 87 - i * 2.1 + (i % 3) * 1.5)),
                isMe: i === 8,
            })),
            allTime: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 9 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(47, Math.min(92, 88 - i * 2.7 + (i % 3) * 2)),
                isMe: i === 9,
            })),
        },
    },
    {
        courseId: "c5",
        averagePercent: 70,
        topper: { name: "Sarah Davis", percentage: 87 },
        leaderboard: {
            weekly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 12 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(45, Math.min(87, 84 - i * 2.5 + (i % 3) * 1)),
                isMe: i === 12,
            })),
            monthly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 13 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(43, Math.min(85, 82 - i * 2.3 + (i % 3) * 1.5)),
                isMe: i === 13,
            })),
            allTime: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 14 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(40, Math.min(87, 83 - i * 2.8 + (i % 3) * 2)),
                isMe: i === 14,
            })),
        },
    },
    {
        courseId: "c6",
        averagePercent: 82,
        topper: { name: "James Miller", percentage: 94 },
        leaderboard: {
            weekly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 5 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(58, Math.min(94, 91 - i * 2.1 + (i % 3) * 1)),
                isMe: i === 5,
            })),
            monthly: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 6 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(56, Math.min(92, 89 - i * 1.9 + (i % 3) * 1.5)),
                isMe: i === 6,
            })),
            allTime: Array.from({ length: 15 }).map((_, i) => ({
                rank: i + 1,
                name: i === 4 ? "You" : `Student ${i + 1}`,
                percentage: Math.max(53, Math.min(94, 90 - i * 2.3 + (i % 3) * 2)),
                isMe: i === 4,
            })),
        },
    },
];

/** @typedef {Object} LeaderboardRow */
const leaderboard: LeaderboardRow[] = Array.from({ length: 20 }).map((_, i) => ({
    rank: i + 1,
    name: i === 7 ? "You" : `Student ${i + 1}`,
    percentage: Math.max(55, Math.min(99, 96 - i * 1.7 + (i % 3) * 2)),
    isMe: i === 7,
}));

/** @typedef {Object} CategoryStat */
const categoryStats: CategoryStat[] = [
    { category: "Algebra", avgPercentage: 86, assessmentsCount: 5 },
    { category: "Geometry", avgPercentage: 78, assessmentsCount: 3 },
    { category: "Trigonometry", avgPercentage: 82, assessmentsCount: 4 },
    { category: "Physics", avgPercentage: 88, assessmentsCount: 6 },
    { category: "Chemistry", avgPercentage: 74, assessmentsCount: 2 },
    { category: "Biology", avgPercentage: 80, assessmentsCount: 3 },
    { category: "History", avgPercentage: 70, assessmentsCount: 2 },
];

/********************
 * Utils & Hooks
 ********************/
function classNames(...cls: (string | boolean | undefined)[]): string {
    return cls.filter(Boolean).join(" ");
}

function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = sessionStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });
    useEffect(() => {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch { }
    }, [key, value]);
    return [value, setValue];
}

const fadeSlide = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 16 } },
};

/********************
 * Core Components
 ********************/
function AppBar({ schoolName = "Blue Ridge High", onMenuClick, onNotificationsClick, userAvatarUrl }: AppBarProps) {
    const navigate = useNavigate();
    return (
        <div className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/80 bg-white shadow-sm">
            <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link to="/" className="font-semibold text-gray-900 text-sm sm:text-base lg:text-lg tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded truncate">
                        {schoolName}
                    </Link>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <button
                        onClick={() => navigate("/reports")}
                        className="hidden sm:inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow hover:shadow-md focus:outline-none focus-visible:ring-2 ring-offset-2 ring-indigo-500"
                        aria-label="Open My Reports"
                        title="My Reports"
                    >
                        <FileBarChart2 className="w-4 h-4" />
                        <span className="hidden md:inline">My Reports</span>
                    </button>
                    <button
                        onClick={onNotificationsClick}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Notifications"
                    >
                        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                        className="ml-1 inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Profile"
                        onClick={() => navigate("/reports")}
                        title="Open My Reports"
                    >
                        {userAvatarUrl ? (
                            <img src={userAvatarUrl} alt="User avatar" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover" />
                        ) : (
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function TabsBar({ tabs, activeTab, onChange }: TabsBarProps) {
    // keyboard navigation
    return (
        <div className="sticky top-14 sm:top-16 z-30 bg-white/90 backdrop-blur border-b">
            <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8">
                <div
                    role="tablist"
                    aria-label="Content tabs"
                    className="relative flex gap-1 sm:gap-2 py-2 sm:py-3 overflow-x-auto"
                >
                    <motion.div
                        className="absolute bottom-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 left-0 right-0 opacity-40"
                        layout
                    />
                    <AnimatePresence initial={false}>
                        {tabs.map((tab: Tab, idx: number) => {
                            const selected = activeTab === idx;
                            return (
                                <button
                                    key={tab.key}
                                    role="tab"
                                    aria-selected={selected}
                                    aria-controls={`tabpanel-${tab.key}`}
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => onChange(idx)}
                                    onKeyDown={(e) => {
                                        if (e.key === "ArrowRight") onChange(Math.min(idx + 1, tabs.length - 1));
                                        if (e.key === "ArrowLeft") onChange(Math.max(idx - 1, 0));
                                    }}
                                    className={classNames(
                                        "relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm lg:text-base whitespace-nowrap focus:outline-none focus-visible:ring-2 ring-indigo-500",
                                        selected
                                            ? "text-indigo-700 bg-indigo-50"
                                            : "text-gray-600 hover:bg-gray-100"
                                    )}
                                >
                                    <span className="font-medium">{tab.label}</span>
                                    {selected && (
                                        <motion.span
                                            layoutId="tabIndicator"
                                            className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-indigo-50 via-violet-50 to-pink-50"
                                            transition={{ type: "spring", stiffness: 200, damping: 24 }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function Badge({ color = "indigo", children }: BadgeProps) {
    const palette = {
        indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
        green: "bg-green-50 text-green-700 ring-green-200",
        gray: "bg-gray-100 text-gray-700 ring-gray-200",
        yellow: "bg-yellow-50 text-yellow-800 ring-yellow-200",
        red: "bg-rose-50 text-rose-700 ring-rose-200",
        blue: "bg-blue-50 text-blue-700 ring-blue-200",
    };
    // @ts-ignore
    const cls = palette[color] || palette.indigo;
    return (
        <span className={classNames("inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ring-1", cls)}>
            {children}
        </span>
    );
}

function AssessmentCard({ item }: AssessmentCardProps) {
    const navigate = useNavigate();
    return (
        <motion.button
            onClick={() => navigate(`/assessment/${item.id}`)}
            className="text-left group w-full rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-black/5 hover:shadow-md transition relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            whileHover={{ y: -2 }}
            aria-label={`Open ${item.title}`}
        >
            <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{item.title}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-gray-600">
                        <Badge color="blue">{item.subject}</Badge>
                        {item.completed ? (
                            <Badge color="green">Completed</Badge>
                        ) : (
                            <Badge color="yellow">Due</Badge>
                        )}
                        <Badge color="gray">{item.totalQuestions} Qs</Badge>
                        <Badge color="gray">{item.totalTimeMinutes} min</Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {item.completed && (
                        <div className="text-right">
                            <div className="text-xs text-gray-500">Score</div>
                            <div className="text-base sm:text-lg font-semibold text-gray-900">{item.percentage}%</div>
                            {item.timeTakenMinutes != null && (
                                <div className="text-xs text-gray-500">{item.timeTakenMinutes} min</div>
                            )}
                        </div>
                    )}
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600" aria-hidden="true" />
                </div>
            </div>
        </motion.button>
    );
}

function SurveyCard({ item }: SurveyCardProps) {
    return (
        <motion.div
            className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-black/5 hover:shadow-md transition"
            whileHover={{ y: -2 }}
            aria-label={`${item.title} survey`}
        >
            <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base truncate">{item.title}</h4>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-gray-600">
                        <Badge color={item.status === "Open" ? "green" : item.status === "Closed" ? "red" : "indigo"}>{item.status}</Badge>
                        <span>Updated {item.updatedAt}</span>
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
            </div>
        </motion.div>
    );
}

function CourseCard({ course }: CourseCardProps) {
    const navigate = useNavigate();
    return (
        <motion.button
            onClick={() => navigate(`/course/${course.id}`)}
            className="text-left group w-full rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-black/5 hover:shadow-md transition relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            whileHover={{ y: -2 }}
            aria-label={`Open ${course.name} course`}
        >
            <div className="flex items-start gap-3 sm:gap-4">
                <div 
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${course.color} flex items-center justify-center text-white font-semibold text-base sm:text-lg flex-shrink-0`}
                    aria-label={`${course.name} course avatar`}
                >
                    {course.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 truncate">{course.name}</h4>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge color="gray">{course.code}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm text-gray-600">My average</div>
                        <div className="text-base sm:text-lg font-semibold text-gray-900">{course.myAveragePercent}%</div>
                    </div>
                    <div className="mt-2 h-1.5 sm:h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div 
                            className={`h-full bg-gradient-to-r ${course.color}`}
                            style={{ width: `${course.myAveragePercent}%` }} 
                        />
                    </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-gray-600 flex-shrink-0" aria-hidden="true" />
            </div>
        </motion.button>
    );
}

function CoursesList() {
    return (
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}

function KpiCard({ label, value, sub }: KpiCardProps) {
    return (
        <motion.div
            variants={fadeSlide}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5"
        >
            <div className="text-sm text-gray-500">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
            {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
        </motion.div>
    );
}

/********************
 * Charts (Recharts)
 ********************/
const CHART_COLORS = ["#6366F1", "#A78BFA", "#22D3EE", "#FB7185"]; // indigo, violet, cyan, rose

function BreakdownDonut({ breakdown }: BreakdownDonutProps) {
    const data = useMemo(() => {
        const { correct = 0, partial = 0, incorrect = 0, notAttempted = 0 } = breakdown || {};
        return [
            { name: "Correct", value: correct },
            { name: "Partial", value: partial },
            { name: "Incorrect", value: incorrect },
            { name: "Not Attempted", value: notAttempted },
        ];
    }, [breakdown]);
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5" role="img" aria-label="Answer breakdown donut chart">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"><ChartPie className="w-4 h-4" /> Breakdown</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                            {data.map((_, i) => (
                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} aria-label={`${data[i].name} ${data[i].value}`} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v, n) => [v, n]} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function TimePerQuestionBar({ perQuestionTime }: TimePerQuestionBarProps) {
    const avg = useMemo(() => {
        if (!perQuestionTime || perQuestionTime.length === 0) return 0;
        const sum = perQuestionTime.reduce((a: number, b: number) => a + b, 0);
        return Math.round(sum / perQuestionTime.length);
    }, [perQuestionTime]);
    const data = (perQuestionTime || []).map((sec: number, i: number) => ({ q: i + 1, sec }));
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5" role="img" aria-label="Time per question bar chart">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Time per Question</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="q" label={{ value: "Q#", position: "insideBottom", offset: -3 }} />
                        <YAxis label={{ value: "sec", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <ReferenceLine y={avg} stroke="#6366F1" strokeDasharray="4 4" label={`avg ${avg}s`} />
                        <Bar dataKey="sec" fill="#A78BFA" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function ScoreTrendArea({ timeline }: ScoreTrendAreaProps) {
    const data = (timeline || []).map((v: number, i: number) => ({ idx: i + 1, score: v }));
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5" role="img" aria-label="Score progression area chart">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2"><LineChart className="w-4 h-4" /> Score Trend</h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.6} />
                                <stop offset="100%" stopColor="#A78BFA" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="idx" label={{ value: "Q/Section", position: "insideBottom", offset: -3 }} />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="score" stroke="#6366F1" fill="url(#gradScore)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function TopicWiseChart({ courseId }: { courseId: string }) {
    const courseTopics = topicStats.filter(topic => topic.courseId === courseId);
    
    // Define a color palette for different bars
    const getTopicColors = () => [
        '#3B82F6', // blue
        '#8B5CF6', // purple
        '#10B981', // green
        '#F59E0B', // amber
        '#EF4444', // red
        '#14B8A6', // teal
        '#F97316', // orange
        '#8B5CF6', // violet
        '#06B6D4', // cyan
        '#84CC16', // lime
    ];
    
    const colors = getTopicColors();
    
    const data = courseTopics.map((topic, index) => ({
        name: topic.topic,
        percentage: topic.avgPercentage,
        assessments: topic.assessmentsCount,
        gained: topic.gainedMarks,
        total: topic.maxMarks,
        fill: colors[index % colors.length] // Assign different color to each bar
    }));

    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5" role="img" aria-label="Topic wise performance chart">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" /> Topic-wise Performance
            </h4>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval={0}
                            fontSize={12}
                        />
                        <YAxis label={{ value: "%", angle: -90, position: "insideLeft" }} />
                        <Tooltip 
                            formatter={(value, name) => {
                                if (name === "percentage") return [`${value}%`, "Average %"];
                                return [value, name];
                            }}
                            labelFormatter={(label) => `Topic: ${label}`}
                        />
                        <Bar 
                            dataKey="percentage" 
                            radius={[4, 4, 0, 0]}
                            name="percentage"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

/********************
 * Lists
 ********************/
function LeaderboardList() {
    const [period, setPeriod] = useState("Weekly");
    const me = leaderboard.find((r) => r.isMe);
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Leaderboard</h4>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    {(["Weekly", "Monthly"]).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={classNames("px-3 py-1.5 text-xs rounded-lg focus:outline-none focus-visible:ring-2 ring-indigo-500", period === p ? "bg-white shadow text-gray-900" : "text-gray-600")}
                            aria-pressed={period === p}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
            <div className="relative max-h-80 overflow-auto pr-1">
                <ul className="divide-y">
                    {leaderboard.map((row) => (
                        <li key={row.rank} className="py-2 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                <span className="w-6 text-gray-500">{row.rank}</span>
                                <span className={classNames("font-medium", row.isMe && "text-indigo-700")}>{row.name}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{row.percentage}%</span>
                        </li>
                    ))}
                </ul>
                {/* Sticky my row */}
                {me && (
                    <div className="sticky bottom-0 -mb-4">
                        <div className="mt-2 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 p-2 ring-1 ring-indigo-200 shadow">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 text-gray-600">{me.rank}</span>
                                    <span className="font-semibold text-indigo-700">You</span>
                                </div>
                                <span className="font-semibold text-indigo-700">{me.percentage}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function CategoryStrengthList() {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Strength by Category</h4>
            <ul className="space-y-3">
                {categoryStats.map((c) => (
                    <li key={c.category} className="">
                        <div className="flex items-center justify-between text-sm">
                            <div className="font-medium text-gray-900">{c.category}</div>
                            <div className="flex items-center gap-2">
                                <Badge color={c.avgPercentage >= 85 ? "green" : c.avgPercentage >= 75 ? "indigo" : "yellow"}>{c.avgPercentage}%</Badge>
                                <span className="text-xs text-gray-500">{c.assessmentsCount} assessments</span>
                            </div>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${c.avgPercentage}%` }} />
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TopicWiseList() {
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Topic-wise Performance</h4>
            <ul className="space-y-3">
                {topicStats.slice(0, 8).map((topic) => {
                    const course = courses.find(c => c.id === topic.courseId);
                    return (
                        <li key={`${topic.courseId}-${topic.topic}`} className="">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div 
                                        className={`w-3 h-3 rounded-full bg-gradient-to-br ${course?.color || 'from-gray-400 to-gray-600'}`}
                                        aria-label={`${course?.name} indicator`}
                                    />
                                    <div className="font-medium text-gray-900">{topic.topic}</div>
                                    <Badge color="gray">{course?.name}</Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge color={topic.avgPercentage >= 85 ? "green" : topic.avgPercentage >= 75 ? "indigo" : "yellow"}>
                                        {topic.avgPercentage}%
                                    </Badge>
                                    <span className="text-xs text-gray-500">{topic.assessmentsCount} tests</span>
                                </div>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-gray-100 overflow-hidden">
                                <div 
                                    className={`h-full bg-gradient-to-r ${course?.color || 'from-gray-500 to-gray-600'}`}
                                    style={{ width: `${topic.avgPercentage}%` }} 
                                />
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function CourseLeaderboard({ report }: CourseLeaderboardProps) {
    const [period, setPeriod] = useState<"weekly" | "monthly" | "allTime">("weekly");
    const leaderboardData = report.leaderboard[period];
    const me = leaderboardData.find((r) => r.isMe);
    
    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Course Leaderboard</h4>
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                    {([
                        { key: "weekly" as const, label: "Weekly" },
                        { key: "monthly" as const, label: "Monthly" },
                        { key: "allTime" as const, label: "All-time" }
                    ]).map((p) => (
                        <button
                            key={p.key}
                            onClick={() => setPeriod(p.key)}
                            className={classNames("px-3 py-1.5 text-xs rounded-lg focus:outline-none focus-visible:ring-2 ring-indigo-500", period === p.key ? "bg-white shadow text-gray-900" : "text-gray-600")}
                            aria-pressed={period === p.key}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="relative max-h-80 overflow-auto pr-1">
                <ul className="divide-y">
                    {leaderboardData.map((row) => (
                        <li key={row.rank} className="py-2 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                                <span className="w-6 text-gray-500">{row.rank}</span>
                                <span className={classNames("font-medium", row.isMe && "text-indigo-700")}>{row.name}</span>
                            </div>
                            <span className="font-semibold text-gray-900">{row.percentage}%</span>
                        </li>
                    ))}
                </ul>
                {/* Sticky my row */}
                {me && (
                    <div className="sticky bottom-0 -mb-4">
                        <div className="mt-2 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 p-2 ring-1 ring-indigo-200 shadow">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="w-6 text-gray-600">{me.rank}</span>
                                    <span className="font-semibold text-indigo-700">You</span>
                                </div>
                                <span className="font-semibold text-indigo-700">{me.percentage}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/********************
 * Screens
 ********************/
function Home({ activeTab, setActiveTab }: HomeProps) {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 420);
        return () => clearTimeout(t);
    }, []);

    const incompleteAssessments = assessments.filter((a) => !a.completed).length;
    const openSurveys = surveys.filter((s) => s.status === "Open").length;
    const tabs = [
        { key: "courses", label: "Courses" },
        { key: "assessments-surveys", label: `Assessments & Surveys (${incompleteAssessments + openSurveys})` },
    ];

    return (
        <div>
            <TabsBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <main className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8 pt-3 sm:pt-4 pb-8">
                {/* Lists */}
                {loading ? (
                    <SkeletonList />
                ) : (
                    <AnimatePresence mode="wait">
                        {activeTab === 0 && (
                            <motion.div
                                key="courses"
                                variants={fadeSlide}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0 }}
                                aria-live="polite"
                            >
                                <CoursesList />
                            </motion.div>
                        )}

                        {activeTab === 1 && (
                            <motion.div
                                key="assessments-surveys"
                                variants={fadeSlide}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0 }}
                                className="grid gap-3 sm:gap-4 lg:grid-cols-2"
                                aria-live="polite"
                            >
                                <section aria-labelledby="all-assessments-heading" className="space-y-2 sm:space-y-3">
                                    <h3 id="all-assessments-heading" className="text-xs sm:text-sm font-semibold text-gray-700">Assessments</h3>
                                    {assessments.map((a) => (
                                        <AssessmentCard key={a.id} item={a} />
                                    ))}
                                </section>
                                <section aria-labelledby="all-surveys-heading" className="space-y-2 sm:space-y-3">
                                    <h3 id="all-surveys-heading" className="text-xs sm:text-sm font-semibold text-gray-700">Surveys</h3>
                                    {surveys.length === 0 ? (
                                        <EmptyState title="No surveys right now" subtitle="Check back later." />
                                    ) : (
                                        surveys.map((s) => <SurveyCard key={s.id} item={s} />)
                                    )}
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </main>
        </div>
    );
}

function AssessmentResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const a = assessments.find((x) => x.id === id) || assessments[0];
    const [innerTab, setInnerTab] = useState(0);

    return (
        <div>
            <div className="sticky top-14 sm:top-16 z-30 bg-white shadow-sm">
                <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <div className="text-xs sm:text-sm font-semibold text-gray-900">Assessment Result</div>
                    <button
                        onClick={() => navigate("/reports")}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Open overall reports"
                        title="My Reports"
                    >
                        <FileBarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
                {/* inner tabs */}
                <div className="border-t">
                    <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8">
                        <div role="tablist" aria-label="Result tabs" className="flex gap-1 sm:gap-2 py-1.5 sm:py-2">
                            {[
                                { key: "summary", label: "Result Summary" },
                                { key: "review", label: "Review Questions" },
                            ].map((t, i) => {
                                const selected = innerTab === i;
                                return (
                                    <button
                                        key={t.key}
                                        role="tab"
                                        aria-selected={selected}
                                        aria-controls={`inner-${t.key}`}
                                        tabIndex={selected ? 0 : -1}
                                        onClick={() => setInnerTab(i)}
                                        className={classNames(
                                            "relative px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm focus:outline-none focus-visible:ring-2 ring-indigo-500",
                                            selected ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                                        )}
                                    >
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8 pt-3 sm:pt-4 pb-8">
                <AnimatePresence mode="wait">
                    {innerTab === 0 ? (
                        <motion.section key="summary" variants={fadeSlide} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                            {/* KPI grid */}
                            <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                                <KpiCard label="Total Questions" value={a.totalQuestions} />
                                <KpiCard label="Total Time Available" value={`${a.totalTimeMinutes} min`} />
                                <KpiCard label="Marks" value={a.maxMarks} />
                                <KpiCard label="Percentage" value={(a.percentage ?? 0) + "%"} />
                                <KpiCard label="Time Taken" value={(a.timeTakenMinutes ?? 0) + " min"} />
                            </div>

                            {/* Attempt breakdown */}
                            <div className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                                <KpiCard label="Attempted" value={a.attemptBreakdown?.attempted ?? 0} />
                                <KpiCard label="Correct" value={a.attemptBreakdown?.correct ?? 0} />
                                <KpiCard label="Partial" value={a.attemptBreakdown?.partial ?? 0} />
                                <KpiCard label="Incorrect" value={a.attemptBreakdown?.incorrect ?? 0} />
                                <KpiCard label="Not Attempted" value={a.attemptBreakdown?.notAttempted ?? 0} />
                            </div>

                            {/* Marks summary */}
                            <div className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3">
                                <KpiCard label="Total Gained Marks" value={a.marksSummary?.gained ?? 0} />
                                <KpiCard label="Negative Marks Lost" value={a.marksSummary?.negative ?? 0} />
                                <KpiCard label="Grand Total Marks" value={a.marksSummary?.grandTotal ?? 0} />
                            </div>

                            {/* Charts */}
                            <div className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 lg:grid-cols-3">
                                <motion.div variants={fadeSlide} initial="hidden" animate="visible">
                                    <BreakdownDonut breakdown={a.attemptBreakdown} />
                                </motion.div>
                                <motion.div variants={fadeSlide} initial="hidden" animate="visible">
                                    <TimePerQuestionBar perQuestionTime={a.perQuestionTime} />
                                </motion.div>
                                <motion.div variants={fadeSlide} initial="hidden" animate="visible">
                                    <ScoreTrendArea timeline={a.scoreTimeline} />
                                </motion.div>
                            </div>
                        </motion.section>
                    ) : (
                        <motion.section key="review" variants={fadeSlide} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                            <EmptyState title="Review Questions coming soon" subtitle="You will be able to step through each question with explanations." />
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function Reports() {
    const navigate = useNavigate();
    const completed = assessments.filter((a) => a.completed);
    const average = Math.round(
        completed.reduce((sum, a) => sum + (a.percentage || 0), 0) / (completed.length || 1)
    );
    const myRow = leaderboard.find((r) => r.isMe) || { rank: 8, percentage: 84 };

    return (
        <div>
            <div className="sticky top-14 sm:top-16 z-30 bg-white shadow-sm">
                <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8 h-12 sm:h-14 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <h2 className="text-xs sm:text-sm font-semibold text-gray-900">My Reports</h2>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8 pt-3 sm:pt-4 pb-8">
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
                    <div className="space-y-3 sm:space-y-4 lg:col-span-2">
                        {/* Averages + My Rank */}
                        <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                            <KpiCard label="Overall Average" value={`${average}%`} sub={`${completed.length} assessments`} />
                            <motion.div className="rounded-2xl bg-white p-3 sm:p-4 shadow-sm ring-1 ring-black/5" variants={fadeSlide} initial="hidden" animate="visible">
                                <div className="text-xs sm:text-sm text-gray-500">Current Leader / My Rank</div>
                                <div className="mt-1 flex items-end justify-between">
                                    <div className="text-xl sm:text-2xl font-semibold text-gray-900">#{myRow.rank}</div>
                                    <div className="text-sm text-gray-600">{myRow.percentage}%</div>
                                </div>
                                <div className="mt-2 sm:mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${100 - (myRow.rank - 1) * 5}%` }} />
                                </div>
                            </motion.div>
                        </div>

                        <LeaderboardList />
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <CategoryStrengthList />
                        <TopicWiseList />
                    </div>
                </div>
            </main>
        </div>
    );
}

function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const course = courses.find((c) => c.id === id) || courses[0];
    const report = courseReports.find((r) => r.courseId === course.id) || courseReports[0];
    const [innerTab, setInnerTab] = useState(0);
    
    const courseAssessments = assessments.filter((a) => a.courseId === course.id);
    const courseSurveys = surveys.filter((s) => s.courseId === course.id);
    const myRank = report.leaderboard.weekly.find((r) => r.isMe)?.rank || 1;

    return (
        <div>
            <div className="sticky top-14 sm:top-16 z-30 bg-white shadow-sm">
                <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Go back"
                    >
                        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 truncate px-2">{course.name}</div>
                    <button
                        onClick={() => navigate("/reports")}
                        className="p-1.5 sm:p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label="Open overall reports"
                        title="My Reports"
                    >
                        <FileBarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
                {/* inner tabs */}
                <div className="border-t">
                    <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8">
                        <div role="tablist" aria-label="Course tabs" className="flex gap-1 sm:gap-2 py-1.5 sm:py-2">
                            {[
                                { key: "content", label: "Content" },
                                { key: "reports", label: "Reports" },
                            ].map((t, i) => {
                                const selected = innerTab === i;
                                return (
                                    <button
                                        key={t.key}
                                        role="tab"
                                        aria-selected={selected}
                                        aria-controls={`inner-${t.key}`}
                                        tabIndex={selected ? 0 : -1}
                                        onClick={() => setInnerTab(i)}
                                        className={classNames(
                                            "relative px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm focus:outline-none focus-visible:ring-2 ring-indigo-500",
                                            selected ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
                                        )}
                                    >
                                        {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-8 pt-3 sm:pt-4 pb-8">
                <AnimatePresence mode="wait">
                    {innerTab === 0 ? (
                        <motion.section key="content" variants={fadeSlide} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                            <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                                <section aria-labelledby="course-assessments-heading" className="space-y-2 sm:space-y-3">
                                    <h3 id="course-assessments-heading" className="text-xs sm:text-sm font-semibold text-gray-700">Assessments</h3>
                                    {courseAssessments.length === 0 ? (
                                        <EmptyState title="No assessments yet" subtitle="Check back later for new assessments." />
                                    ) : (
                                        courseAssessments.map((a) => (
                                            <AssessmentCard key={a.id} item={a} />
                                        ))
                                    )}
                                </section>
                                <section aria-labelledby="course-surveys-heading" className="space-y-2 sm:space-y-3">
                                    <h3 id="course-surveys-heading" className="text-xs sm:text-sm font-semibold text-gray-700">Surveys</h3>
                                    {courseSurveys.length === 0 ? (
                                        <EmptyState title="No surveys yet" subtitle="Check back later for new surveys." />
                                    ) : (
                                        courseSurveys.map((s) => (
                                            <SurveyCard key={s.id} item={s} />
                                        ))
                                    )}
                                </section>
                            </div>
                        </motion.section>
                    ) : (
                        <motion.section key="reports" variants={fadeSlide} initial="hidden" animate="visible" exit={{ opacity: 0 }}>
                            {/* Course KPIs */}
                            <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-3 mb-3 sm:mb-4">
                                <KpiCard label="Course Average" value={`${report.averagePercent}%`} />
                                <KpiCard label="Course Topper" value={report.topper.name} sub={`${report.topper.percentage}%`} />
                                <KpiCard label="My Rank" value={`#${myRank}`} sub={`${report.leaderboard.weekly.find((r) => r.isMe)?.percentage || 0}%`} />
                            </div>
                            
                            {/* Topic-wise Chart and Course Leaderboard */}
                            <div className="grid gap-3 sm:gap-4 lg:grid-cols-2 mb-3 sm:mb-4">
                                <TopicWiseChart courseId={course.id} />
                                <CourseLeaderboard report={report} />
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

/********************
 * UI Helpers
 ********************/
function EmptyState({ title, subtitle }: EmptyStateProps) {
    return (
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-pink-100 flex items-center justify-center mb-3">
                <FileBarChart2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
    );
}

function SkeletonList() {
    return (
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="mt-3 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/********************
 * Root App
 ********************/
export default function ReportsApp() {
    const [activeTab, setActiveTab] = useSessionStorage("activeTab", 0);
    const location = useLocation();

    // Reset focus ring outline offset for keyboard users
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Tab") document.documentElement.classList.add("outline-offset-2");
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-pink-50 text-gray-900">
            <AppBar
                onMenuClick={() => alert("Menu")}
                onNotificationsClick={() => alert("No new notifications")}
            />

            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home activeTab={activeTab} setActiveTab={setActiveTab} />} />
                    <Route path="/assessment/:id" element={<AssessmentResult />} />
                    <Route path="/course/:id" element={<CourseDetails />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="*" element={<Home activeTab={activeTab} setActiveTab={setActiveTab} />} />
                </Routes>
            </AnimatePresence>
        </div>
    );
}

