export class CourseStatus {
    public readonly label: string;
    public readonly value: string;

    constructor({ label, value }: { label: string, value: string }) {
        this.label = label;
        this.value = value;
    }

    public static readonly ACTIVE = new CourseStatus({ label: "Active", value: "active" });
    public static readonly CLOSED = new CourseStatus({ label: "Closed", value: "closed" });

    private static readonly VALUE_MAP: Map<string, CourseStatus> = new Map([
        [CourseStatus.ACTIVE.value, CourseStatus.ACTIVE],
        [CourseStatus.CLOSED.value, CourseStatus.CLOSED]
    ]);

    public static fromValue(value: string): CourseStatus {
        const status = CourseStatus.VALUE_MAP.get(value);
        if (!status) {
            throw new Error(`Unknown CourseStatus value: ${value}`);
        }
        return status;
    }

    public isActive(): boolean {
        return this === CourseStatus.ACTIVE;
    }

    public isClosed(): boolean {
        return this === CourseStatus.CLOSED;
    }
}

