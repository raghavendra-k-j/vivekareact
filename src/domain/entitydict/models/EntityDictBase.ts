import { JsonObj } from "~/core/types/Json";

export interface EntityDictParams {
    defId: string;
    nameSingular: string;
    namePlural: string;
}

export class EntityDictBase {
    defId: string;
    nameSingular: string
    namePlural: string;

    constructor(params: EntityDictParams) {
        this.defId = params.defId;
        this.nameSingular = params.nameSingular;
        this.namePlural = params.namePlural;
    }

    static fromJson(json: JsonObj): EntityDictBase {
        return new EntityDictBase({
            defId: String(json.defId),
            nameSingular: String(json.nameSingular),
            namePlural: String(json.namePlural),
        });
    }
}