export class SpaceStatus {

    public readonly status: string;
    public readonly label: string;

    constructor(status: string, label: string) {
        this.status = status;
        this.label = label;
    }

    public static readonly ACTIVE = new SpaceStatus("active", "Active");
    public static readonly CLOSED = new SpaceStatus("closed", "Closed");
}