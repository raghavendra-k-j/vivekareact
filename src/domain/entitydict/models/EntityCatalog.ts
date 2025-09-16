import { JsonObj } from "~/core/types/Json";
import { EntityModule } from "./EntityModule";

export class EntityCatalog {
    modules: EntityModule[];
    _modulesMap: Map<string, EntityModule>;

    constructor(modules: EntityModule[]) {
        this.modules = modules;
        this._modulesMap = new Map(modules.map((m) => [m.module.id, m]));
    }

    static fromJson(json: JsonObj): EntityCatalog {
        const modules = (json.modules as JsonObj[]).map((e) => EntityModule.fromJson(e));
        return new EntityCatalog(modules);
    }

    module(id: string) {
        return this._modulesMap.get(id)!;
    }
}