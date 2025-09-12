export class CurrentFragment {

    public id: string;
    public title: string;

    constructor(id: string, title: string) {
        this.id = id;
        this.title = title;
    }

    public static readonly COURSES = new CurrentFragment("courses", "Courses");
    public static readonly FORMS = new CurrentFragment("forms", "Assessment and Surveys");
    public static readonly values = [CurrentFragment.COURSES, CurrentFragment.FORMS];
}