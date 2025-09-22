export class CourseStatus {
    public readonly label: string;
    public readonly value: string;

    constructor({ label, value }: { label: string, value: string }) {
        this.label = label;
        this.value = value;
    }

    public static readonly DRAFT = new CourseStatus({ label: "Draft", value: "draft" });
    public static readonly ACTIVE = new CourseStatus({ label: "Active", value: "active" });
    public static readonly COMPLETED = new CourseStatus({ label: "Completed", value: "completed" });

    private static readonly VALUE_MAP: Map<string, CourseStatus> = new Map([
        [CourseStatus.DRAFT.value, CourseStatus.DRAFT],
        [CourseStatus.ACTIVE.value, CourseStatus.ACTIVE],
        [CourseStatus.COMPLETED.value, CourseStatus.COMPLETED]
    ]);

    public static fromValue(value: string): CourseStatus {
        const status = CourseStatus.VALUE_MAP.get(value);
        if (!status) {
            throw new Error(`Unknown CourseStatus value: ${value}`);
        }
        return status;
    }

    public get isDraft(): boolean {
        return this === CourseStatus.DRAFT;
    }

    public get isActive(): boolean {
        return this === CourseStatus.ACTIVE;
    }

    public get isCompleted(): boolean {
        return this === CourseStatus.COMPLETED;
    }
}

