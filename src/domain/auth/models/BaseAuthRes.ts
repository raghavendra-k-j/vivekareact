

import { JsonObj } from "~/core/types/Json";
import { AbsUser } from "~/domain/common/models/AbsUser";
import { AuthUser } from "~/domain/common/models/AuthUser"
import { PlanAndUsage } from "~/domain/common/models/PlanAndUsage";
import { EntityCatalog } from "~/domain/entitydict/models/EntityCatalog";

export type BaseAuthResProps = {
    user: AbsUser;
    planAndUsage: PlanAndUsage;
    entityDictRes: EntityCatalog;
}

export class BaseAuthRes {
    constructor(
        public readonly user: AbsUser,
        public readonly planAndUsage: PlanAndUsage,
        public readonly entityCatalog: EntityCatalog,
    ) { }

    static fromAuthUserRes(json: JsonObj): BaseAuthRes {
        const user = AuthUser.fromJson(json.user);
        const planAndUsage = PlanAndUsage.fromJson(json.planAndUsage);
        const entityCatalog = EntityCatalog.fromJson(json.entityCatalog);
        return new BaseAuthRes(user, planAndUsage, entityCatalog);
    }
}
