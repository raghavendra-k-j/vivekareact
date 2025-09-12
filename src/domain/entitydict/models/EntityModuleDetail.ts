import { JsonObj } from "~/core/types/Json";
import { EntityDict } from "./EntityDict";
import { EntityModule } from "./EntityModule";

export class EntityModuleDetail {

    module: EntityModule;
    entities: EntityDict[];

    constructor({ module, entities }: { module: EntityModule; entities: EntityDict[] }) {
        this.module = module;
        this.entities = entities;
    }

    static fromJson(json: JsonObj): EntityModuleDetail {
        const module = EntityModule.fromJson(json.module);
        const entities = (json.entities as JsonObj[]).map((e) => EntityDict.fromJson(e));
        return new EntityModuleDetail({ module, entities });
    }
}