import { JsonObj } from "~/core/types/Json";

export class AddMembersReq {
    public courseId: number;
    public userIds: number[];

    constructor({ courseId, userIds }: { courseId: number, userIds: number[] }) {
        this.courseId = courseId;
        this.userIds = userIds;
    }

    toJson(): JsonObj {
        return {
            courseId: this.courseId,
            userIds: this.userIds
        };
    }
}

export class AddMembersRes {
    public errors: AddMemberError[];

    constructor({ errors }: { errors: AddMemberError[] }) {
        this.errors = errors;
    }

    static fromJson(json: JsonObj): AddMembersRes {
        const errors = (json.errors as JsonObj[]).map(e => AddMemberError.fromJson(e));
        return new AddMembersRes({ errors });
    }
}

export class AddMemberError {
    public userId: number;
    public error: string;

    constructor({ userId, error }: { userId: number, error: string }) {
        this.userId = userId;
        this.error = error;
    }

    static fromJson(json: JsonObj): AddMemberError {
        return new AddMemberError({
            userId: Number(json.userId),
            error: String(json.error)
        });
    }
}

export class RemoveMembersReq {
    public courseId: number;
    public userIds: number[];

    constructor({ courseId, userIds }: { courseId: number, userIds: number[] }) {
        this.courseId = courseId;
        this.userIds = userIds;
    }

    toJson(): JsonObj {
        return {
            courseId: this.courseId,
            userIds: this.userIds
        };
    }
}

export class RemoveMembersRes {
    public errors: RemoveMemberError[];

    constructor({ errors }: { errors: RemoveMemberError[] }) {
        this.errors = errors;
    }

    static fromJson(json: JsonObj): RemoveMembersRes {
        const errors = (json.errors as JsonObj[]).map(e => RemoveMemberError.fromJson(e));
        return new RemoveMembersRes({ errors });
    }
}

export class RemoveMemberError {
    public userId: number;
    public error: string;

    constructor({ userId, error }: { userId: number, error: string }) {
        this.userId = userId;
        this.error = error;
    }

    static fromJson(json: JsonObj): RemoveMemberError {
        return new RemoveMemberError({
            userId: Number(json.userId),
            error: String(json.error)
        });
    }
}