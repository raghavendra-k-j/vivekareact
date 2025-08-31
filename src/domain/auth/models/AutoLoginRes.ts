import { JsonObj } from "~/core/types/Json";
import { AuthToken } from "~/domain/common/models/AuthToken";
import { BaseAuthRes } from "./BaseAuthRes";

export type AutoLoginResProps = {
    baseAuthRes: BaseAuthRes;
    authToken: AuthToken;
}

export class AutoLoginRes {
    constructor(
        public readonly baseAuthRes: BaseAuthRes,
        public readonly authToken: AuthToken,
    ) { }

    static fromJson(json: JsonObj): AutoLoginRes {
        const baseAuthRes = BaseAuthRes.fromAuthUserRes(json);
        const authToken = AuthToken.fromJson(json);
        return new AutoLoginRes(baseAuthRes, authToken);
    }

}