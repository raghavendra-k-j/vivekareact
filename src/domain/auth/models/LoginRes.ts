import { JsonObj } from "~/core/types/Json";
import { BaseAuthRes } from "./BaseAuthRes";
import { AuthToken } from "~/domain/common/models/AuthToken";

export class LoginRes {
    constructor(
        public readonly baseAuthRes: BaseAuthRes,
        public readonly authToken: AuthToken,
        public readonly resetPasswordToken: string | null,
    ) { }

    static fromJson(json: JsonObj): LoginRes {
        const baseAuthRes = BaseAuthRes.fromAuthUserRes(json.baseAuthRes);
        const authToken = AuthToken.fromJson(json.authToken);
        let resetPasswordToken: string | null = null;
        if (json.resetPasswordToken && typeof json.resetPasswordToken === "string") {
            resetPasswordToken = json.resetPasswordToken;
        }
        return new LoginRes(baseAuthRes, authToken, resetPasswordToken);
    }
}
