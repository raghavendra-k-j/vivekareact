import { JsonObj } from "~/core/types/Json";
import { BaseAuthRes } from "./BaseAuthRes";


export type SoftLoginResProps = {
    baseAuthRes: BaseAuthRes;
};

export class SoftLoginRes {
    constructor(
        public readonly baseAuthRes: BaseAuthRes,
    ) { }

    static fromJson(json: JsonObj): SoftLoginRes {
        const baseAuthRes = BaseAuthRes.fromAuthUserRes(json.baseAuthRes);
        return new SoftLoginRes(baseAuthRes);
    }
}