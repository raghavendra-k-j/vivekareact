import { JsonObj } from "~/core/types/Json";

export class BoolResult {
    result: boolean;

    constructor(result: boolean) {
        this.result = result;
    }

    static fromJson(json: JsonObj): BoolResult {
        return new BoolResult(Boolean(json.result));
    }

    toJson(): JsonObj {
        return {
            result: this.result
        };
    }
}