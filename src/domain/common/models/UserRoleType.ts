export type UserRoleTypeProps = {
    label: string;
    value: string;
}

export class UserRoleType {
    readonly label: string;
    readonly value: string;

    private constructor(props: UserRoleTypeProps) {
        this.label = props.label;
        this.value = props.value;
    }

    static readonly admin = new UserRoleType({
        label: "Admin",
        value: "ADMIN",
    });

    static readonly user = new UserRoleType({
        label: "User",
        value: "USER",
    });

    static readonly values = Object.freeze([UserRoleType.admin, UserRoleType.user]);

    static fromValueStr(value: string): UserRoleType {
        const userRole = UserRoleType.values.find(role => role.value === value);
        if (!userRole) {
            throw new Error(`Unknown UserRoleType value: ${value}`);
        }
        return userRole;
    }
}
