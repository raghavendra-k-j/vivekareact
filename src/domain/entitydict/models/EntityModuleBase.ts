import { JsonObj } from "~/core/types/Json";

export interface EntityModuleBaseParams {
    id: string;
    nameSingular: string;
    namePlural: string;
}

export class EntityModuleBase {
    id: string;
    nameSingular: string;
    namePlural: string;

    constructor(params: EntityModuleBaseParams) {
        this.id = params.id;
        this.nameSingular = params.nameSingular;
        this.namePlural = params.namePlural;
    }

    static fromJson(json: JsonObj): EntityModuleBase {
        return new EntityModuleBase({
            id: String(json.id),
            nameSingular: String(json.nameSingular),
            namePlural: String(json.namePlural),
        });
    }
}