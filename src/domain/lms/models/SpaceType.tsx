export class SpaceType {

    public readonly type: string;
    public readonly label: string;

    constructor(type: string, label: string) {
        this.type = type;
        this.label = label;
    }

    public static readonly FOLDER = new SpaceType("folder", "Folder");
    public static readonly COURSE = new SpaceType("course", "Course");

    public static fromValue(value: string): SpaceType {
        if(value === SpaceType.FOLDER.type) return SpaceType.FOLDER;
        if(value === SpaceType.COURSE.type) return SpaceType.COURSE;
        throw new Error(`Unknown SpaceType value: ${value}`);
    }


    get isFolder(): boolean {
        return this === SpaceType.FOLDER;
    }

    get isCourse(): boolean {
        return this === SpaceType.COURSE;
    }

}