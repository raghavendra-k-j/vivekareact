import { AppUserType } from "./AppUserType";

export abstract class AbsUser {
    abstract get id(): number
    abstract get name(): string
    abstract get email(): string
    abstract get mobile(): string | null;
    abstract get appUserType(): AppUserType;
}