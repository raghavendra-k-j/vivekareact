import { HomeLayoutData } from "~/domain/common/models/HomeLayout";
import { HomePageWrapper } from "../home/components/HomePageContent";

// Types
type CourseStatus = 'active' | 'closed';

type Course = {
    id: number;
    name: string;
    avatar: {
        gradient: string;
        initials: string;
        textColor: string;
    };
    completed: number;
    total: number;
    averagePercentage: number;
    status: CourseStatus;
};

// Mock data
const mockCourses: Course[] = [
    {
        id: 1,
        name: "Advanced Mathematics",
        avatar: {
            gradient: "linear-gradient(to bottom right, #1e3c72, #2a5298)",
            initials: "AM",
            textColor: "white"
        },
        completed: 8,
        total: 12,
        averagePercentage: 87,
        status: "active"
    },
    {
        id: 2,
        name: "Physics Fundamentals",
        avatar: {
            gradient: "linear-gradient(to bottom right, #667eea, #764ba2)",
            initials: "PF",
            textColor: "white"
        },
        completed: 15,
        total: 20,
        averagePercentage: 92,
        status: "active"
    },
    {
        id: 3,
        name: "Chemistry Basics",
        avatar: {
            gradient: "linear-gradient(to bottom right, #f093fb, #f5576c)",
            initials: "CB",
            textColor: "white"
        },
        completed: 5,
        total: 15,
        averagePercentage: 74,
        status: "active"
    },
    {
        id: 4,
        name: "Computer Science Introduction",
        avatar: {
            gradient: "linear-gradient(to bottom right, #4facfe, #00f2fe)",
            initials: "CS",
            textColor: "white"
        },
        completed: 22,
        total: 25,
        averagePercentage: 95,
        status: "closed"
    },
    {
        id: 5,
        name: "Biology Concepts",
        avatar: {
            gradient: "linear-gradient(to bottom right, #fa709a, #fee140)",
            initials: "BC",
            textColor: "white"
        },
        completed: 3,
        total: 18,
        averagePercentage: 68,
        status: "active"
    }
];

// Component: Course Avatar
function CourseAvatar({ avatar }: { avatar: Course['avatar'] }) {
    return (
        <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm"
            style={{
                background: avatar.gradient,
                color: avatar.textColor
            }}
        >
            {avatar.initials}
        </div>
    );
}

// Component: Course Header
function CourseHeader({ course }: { course: Course }) {
    return (
        <div className="flex items-center justify-between mb-3">
            <CourseAvatar avatar={course.avatar} />
            <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                    {course.averagePercentage}%
                </div>
                <div className="text-xs text-gray-500">
                    Average
                </div>
            </div>
        </div>
    );
}

// Component: Course Progress
function CourseProgress({ course }: { course: Course }) {
    const progressPercentage = (course.completed / course.total) * 100;

    return (
        <div className="mt-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{course.completed}/{course.total} lessons</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                        width: `${progressPercentage}%`,
                        background: course.avatar.gradient
                    }}
                ></div>
            </div>
            <div className="text-center mt-2">
                <span className="text-sm font-medium text-gray-700">
                    {Math.round(progressPercentage)}% Complete
                </span>
            </div>
        </div>
    );
}

// Component: Course Card
function CourseCard({ course }: { course: Course }) {
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow h-full flex flex-col">
            <CourseHeader course={course} />

            {/* Course Name */}
            <h3 className="text-base font-semibold text-gray-900 mb-3 flex-1 leading-snug">
                {course.name}
            </h3>

            <CourseProgress course={course} />
        </div>
    );
}

// Component: Course Grid
function CourseGrid({ courses }: { courses: Course[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {courses.map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}

export default function CoursesPage() {
    return (<HomePageWrapper id={HomeLayoutData.ID_COURSES}>
        <div className="mx-auto container p-4">
            <CourseGrid courses={mockCourses} />
        </div>
    </HomePageWrapper>);
}