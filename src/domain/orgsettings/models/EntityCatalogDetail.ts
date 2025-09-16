import { JsonObj } from "~/core/types/Json";
import { EntityDictDef } from "./EntityDictDef";
import { EntityModuleBase } from "~/domain/entitydict/models/EntityModuleBase";

export interface EntityModuleDetailParams {
    base: EntityModuleBase;
    description: string;
    editUIPosition: number;
    entities: EntityDictDef[];
}

export class EntityModuleDetail {
    base: EntityModuleBase;
    description: string;
    editUIPosition: number;
    entities: EntityDictDef[];

    constructor(params: EntityModuleDetailParams) {
        this.base = params.base;
        this.description = params.description;
        this.editUIPosition = params.editUIPosition;
        this.entities = params.entities;
    }

    static fromJson(json: JsonObj): EntityModuleDetail {
        return new EntityModuleDetail({
            base: EntityModuleBase.fromJson(json.base as JsonObj),
            description: String(json.description),
            editUIPosition: Number(json.editUIPosition),
            entities: (json.entities as JsonObj[]).map((e) => EntityDictDef.fromJson(e)),
        });
    }
}

export interface EntityCatalogDetailParams {
    modules: EntityModuleDetail[];
}

export class EntityCatalogDetail {
    modules: EntityModuleDetail[];

    constructor(params: EntityCatalogDetailParams) {
        this.modules = params.modules;
    }

    static fromJson(json: JsonObj): EntityCatalogDetail {
        return new EntityCatalogDetail({
            modules: (json.modules as JsonObj[]).map((e) => EntityModuleDetail.fromJson(e)),
        });
    }
}



