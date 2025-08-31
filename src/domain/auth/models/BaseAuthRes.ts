

import { JsonObj } from "~/core/types/Json";
import { AbsUser } from "~/domain/common/models/AbsUser";
import { AuthUser } from "~/domain/common/models/AuthUser"
import { PlanAndUsage } from "~/domain/common/models/PlanAndUsage";

export type BaseAuthResProps = {
    user: AbsUser;
    planAndUsage: PlanAndUsage;
}

export class BaseAuthRes {
    constructor(
        public readonly user: AbsUser,
        public readonly planAndUsage: PlanAndUsage
    ) { }

    static fromAuthUserRes(json: JsonObj): BaseAuthRes {
        const user = AuthUser.fromJson(json.user);
        const planAndUsage = PlanAndUsage.fromJson(json);
        return new BaseAuthRes(user, planAndUsage);
    }
}
