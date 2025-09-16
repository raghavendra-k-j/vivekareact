export class SpaceMemberRole {

    public readonly role: string;
    public readonly label: string;

    constructor(role: string, label: string) {
        this.role = role;
        this.label = label;
    }

    public static readonly ADMIN = new SpaceMemberRole("admin", "Admin");
    public static readonly USER = new SpaceMemberRole("user", "User");

    public static fromValue(value: string): SpaceMemberRole {
        if (value === SpaceMemberRole.ADMIN.role) return SpaceMemberRole.ADMIN;
        if (value === SpaceMemberRole.USER.role) return SpaceMemberRole.USER;
        throw new Error(`Unknown SpaceMemberRole value: ${value}`);
    }

    get isAdmin(): boolean {
        return this === SpaceMemberRole.ADMIN;
    }

    get isUser(): boolean {
        return this === SpaceMemberRole.USER;
    }
}