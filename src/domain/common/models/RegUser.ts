import type { AbsUser } from "./AbsUser";
import { AppUserType } from "./AppUserType";
import { UserBase } from "./UserBase";

export type RegUserProps = {
    base: UserBase;
}

export abstract class RegUser implements AbsUser {
    base: UserBase;

    constructor(props: RegUserProps) {
        this.base = props.base;
    }

    get id(): number {
        return this.base.id;
    }
    get name(): string {
        return this.base.name;
    }
    get email(): string {
        return this.base.email;
    }
    get mobile(): string | null {
        return this.base.mobile;
    }
    abstract get appUserType(): AppUserType;
}
