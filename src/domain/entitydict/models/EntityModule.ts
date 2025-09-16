import { JsonObj } from "~/core/types/Json";
import { EntityModuleBase } from "./EntityModuleBase";
import { EntityDictBase } from "./EntityDictBase";

export class EntityModule {
    module: EntityModuleBase;
    entities: EntityDictBase[];
    _entitiesMap: Map<string, EntityDictBase>;

    constructor({ module, entities }: { module: EntityModuleBase; entities: EntityDictBase[] }) {
        this.module = module;
        this.entities = entities;
        this._entitiesMap = new Map(entities.map((e) => [e.defId, e]));
    }

    static fromJson(json: JsonObj): EntityModule {
        const module = EntityModuleBase.fromJson(json.module as JsonObj);
        const entities = (json.entities as JsonObj[]).map((e) => EntityDictBase.fromJson(e));
        return new EntityModule({ module, entities });
    }

    entity(defId: string) {
        return this._entitiesMap.get(defId)!;
    }

}