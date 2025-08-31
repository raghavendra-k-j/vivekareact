

import { AbsUser } from "~/domain/common/models/AbsUser";
import { AuthUser } from "~/domain/common/models/AuthUser"
import { PlanAndUsage } from "~/domain/common/models/PlanAndUsage";

export type BaseAbsAuthResProps = {
    user: AbsUser;
    planAndUsage: PlanAndUsage;
}

export class BaseAbsAuthRes {
    constructor(
        public readonly user: AbsUser,
        public readonly planAndUsage: PlanAndUsage
    ) { }

    static fromJson(json: any): BaseAbsAuthRes {
        const user = AuthUser.fromJson(json.user);
        const planAndUsage = PlanAndUsage.fromJson(json);
        return new BaseAbsAuthRes(user, planAndUsage);
    }
}
