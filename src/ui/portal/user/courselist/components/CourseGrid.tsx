import { HomeGridContainer } from "../../home/HomeGridContainer";
import { useCourseListStore } from "../CourseListContext";
import { CourseCard } from "./CourseCard";
import { CourseCardSkeleton } from "./CourseCard";

export function CourseGrid() {
    const store = useCourseListStore();
    return (
        <HomeGridContainer>
            {store.courses.map(course => (
                <CourseCard key={course.base.id} course={course} />
            ))}
        </HomeGridContainer>
    );
}

export function CourseGridSkeleton() {
    return (
        <HomeGridContainer>
            {Array.from({ length: 8 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
            ))}
        </HomeGridContainer>
    );
}