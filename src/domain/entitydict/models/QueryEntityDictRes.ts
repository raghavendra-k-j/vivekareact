import { JsonObj } from "~/core/types/Json";
import { EntityModuleDetail } from "./EntityModuleDetail";

export class QueryEntityDictRes {
    items: EntityModuleDetail[];


    constructor(items: EntityModuleDetail[]) {
        this.items = items;
    }

    static fromJson(json: JsonObj): QueryEntityDictRes {
        const items = (json.items as JsonObj[]).map((e) => EntityModuleDetail.fromJson(e));
        return new QueryEntityDictRes(items);
    }
}