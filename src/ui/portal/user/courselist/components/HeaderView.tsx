import { Button } from "~/ui/widgets/button/Button";
import { useCourseListStore } from "../CourseListContext";

export function HeaderView() {
    const store = useCourseListStore();
    return (
        <div className="flex items-center justify-between container mx-auto">
            <div className="flex items-center">
                <h1 className="text-xl sm:text-xl font-semibold text-default">
                    My Courses
                </h1>
            </div>
            <div className="flex items-center">
                <Button
                    onClick={() => store.onClickJoinCourse()}
                >
                    Join Course
                </Button>
            </div>
        </div>
    );
}