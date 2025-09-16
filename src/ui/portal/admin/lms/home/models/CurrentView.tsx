export class HomeCurrentView {
    public readonly id: string;

    constructor({ id }: { id: string;}) {
        this.id = id;
    }

    public static readonly allspaces = new HomeCurrentView({ id: "all" });
    public static readonly mycourses = new HomeCurrentView({ id: "mycourses" });

    get isAllSpaces() {
        return this.id === HomeCurrentView.allspaces.id;
    }

    get isMyCourses() {
        return this.id === HomeCurrentView.mycourses.id;
    }

}