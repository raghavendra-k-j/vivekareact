export class SpaceType {

    public readonly value: string;
    public readonly label: string;
    public readonly labelPlural: string;

    constructor(value: string, label: string, labelPlural: string) {
        this.value = value;
        this.label = label;
        this.labelPlural = labelPlural;
    }

    public static readonly FOLDER = new SpaceType("folder", "Folder", "Folders");
    public static readonly COURSE = new SpaceType("course", "Course", "Courses");

    public static fromValue(value: string): SpaceType {
        if(value === SpaceType.FOLDER.value) return SpaceType.FOLDER;
        if(value === SpaceType.COURSE.value) return SpaceType.COURSE;
        throw new Error(`Unknown SpaceType value: ${value}`);
    }

    get isFolder(): boolean {
        return this === SpaceType.FOLDER;
    }

    get isCourse(): boolean {
        return this === SpaceType.COURSE;
    }
}