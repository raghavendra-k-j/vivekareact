import { makeAutoObservable } from "mobx";
import { UserPortalStore } from "../root/UserPortalStore";

export interface CoursePageStoreProps {
    userPortal: UserPortalStore;
}

export class CoursePageStore {
    constructor(_props: CoursePageStoreProps) {
        // Store reference for future use (API calls, user context, etc.)
        makeAutoObservable(this);
    }

    // Course data - normally would come from API
    get courseData() {
        return {
            id: "math-101",
            name: "Advanced Mathematics",
            description: "Master advanced mathematical concepts including algebra, geometry, trigonometry, and calculus",
            teachers: ["Dr. Sarah Johnson", "Prof. Michael Chen", "Dr. Lisa Wang"],
            bgColor: "#3B82F6",
            totalAssessments: 12,
            completedAssessments: 8,
            totalSurveys: 6,
            completedSurveys: 3,
            averageScore: 85,
            rank: 12,
            totalStudents: 150,
            enrollmentDate: new Date("2024-01-15")
        };
    }

    // Calculate completion rate (assessments + surveys combined)
    get completionRate() {
        const course = this.courseData;
        const totalItems = course.totalAssessments + course.totalSurveys;
        const completedItems = course.completedAssessments + course.completedSurveys;
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }

    get assessments() {
        return [
            {
                id: 1,
                title: "Linear Algebra Fundamentals",
                questions: 25,
                duration: 60,
                difficulty: "Easy",
                topic: "Algebra",
                status: "completed",
                score: 92,
                dueDate: "2024-03-15",
            },
            {
                id: 2,
                title: "Quadratic Equations",
                questions: 20,
                duration: 45,
                difficulty: "Medium",
                topic: "Algebra",
                status: "completed",
                score: 88,
                dueDate: "2024-03-22",
            },
            {
                id: 3,
                title: "Geometry Basics",
                questions: 30,
                duration: 75,
                difficulty: "Easy",
                topic: "Geometry",
                status: "completed",
                score: 85,
                dueDate: "2024-04-01",
            },
            {
                id: 4,
                title: "Trigonometry Applications",
                questions: 22,
                duration: 50,
                difficulty: "Medium",
                topic: "Trigonometry",
                status: "in-progress",
                progress: 65,
                dueDate: "2024-04-10",
            },
            {
                id: 5,
                title: "Advanced Calculus",
                questions: 35,
                duration: 90,
                difficulty: "Hard",
                topic: "Calculus",
                status: "pending",
                dueDate: "2024-04-20",
            },
            {
                id: 6,
                title: "Statistics and Probability",
                questions: 28,
                duration: 65,
                difficulty: "Medium",
                topic: "Statistics",
                status: "locked",
                dueDate: "2024-05-01",
            }
        ];
    }

    get topicSummary() {
        return [
            { name: 'Algebra', score: 92, grade: 'A+', assessments: 3, completed: 3, total: 3, color: '#10B981' },
            { name: 'Geometry', score: 85, grade: 'A', assessments: 2, completed: 2, total: 2, color: '#3B82F6' },
            { name: 'Trigonometry', score: 75, grade: 'B', assessments: 2, completed: 1, total: 2, color: '#F59E0B' },
            { name: 'Calculus', score: 60, grade: 'C', assessments: 1, completed: 0, total: 1, color: '#EF4444' },
        ];
    }
}