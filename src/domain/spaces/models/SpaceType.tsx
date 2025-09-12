export class SpaceType {

    public readonly type: string;
    public readonly label: string;

    constructor(type: string, label: string) {
        this.type = type;
        this.label = label;
    }

    public static readonly COURSE = new SpaceType("course", "Course");

}