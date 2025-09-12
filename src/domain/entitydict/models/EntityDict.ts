import { JsonObj } from "~/core/types/Json";

export interface EntityDictParams {
    entityDictId: number;
    id: string;
    orgId: number;
    nameSingular: string;
    namePlural: string;
    moduleId: string;
}

export class EntityDict {
    entityDictId: number;
    id: string;
    orgId: number;
    nameSingular: string;
    namePlural: string;
    moduleId: string;

    constructor(params: EntityDictParams) {
        this.entityDictId = params.entityDictId;
        this.id = params.id;
        this.orgId = params.orgId;
        this.nameSingular = params.nameSingular;
        this.namePlural = params.namePlural;
        this.moduleId = params.moduleId;
    }

    static fromJson(json: JsonObj): EntityDict {
        return new EntityDict({
            entityDictId: json.entityDictId,
            id: json.id,
            orgId: json.orgId,
            nameSingular: json.nameSingular,
            namePlural: json.namePlural,
            moduleId: json.moduleId,
        });
    }
}