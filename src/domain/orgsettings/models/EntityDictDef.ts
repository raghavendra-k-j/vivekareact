import { JsonObj } from "~/core/types/Json";

export interface EntityDictDefParams {
    id: number;
    defId: string;
    orgId: number;
    defNameSingular: string;
    defNamePlural: string;
    description: string;
    nameSingular: string;
    namePlural: string;
    moduleId: string;
    editUIPosition: number;
}

export class EntityDictDef {
    id: number;
    defId: string;
    orgId: number;
    defNameSingular: string;
    defNamePlural: string;
    description: string;
    nameSingular: string;
    namePlural: string;
    moduleId: string;
    editUIPosition: number;

    constructor(params: EntityDictDefParams) {
        this.id = params.id;
        this.defId = params.defId;
        this.orgId = params.orgId;
        this.defNameSingular = params.defNameSingular;
        this.defNamePlural = params.defNamePlural;
        this.description = params.description;
        this.nameSingular = params.nameSingular;
        this.namePlural = params.namePlural;
        this.moduleId = params.moduleId;
        this.editUIPosition = params.editUIPosition;
    }

    static fromJson(json: JsonObj): EntityDictDef {
        return new EntityDictDef({
            id: Number(json.id),
            defId: String(json.defId),
            orgId: Number(json.orgId),
            defNameSingular: String(json.defNameSingular),
            defNamePlural: String(json.defNamePlural),
            description: String(json.description),
            nameSingular: String(json.nameSingular),
            namePlural: String(json.namePlural),
            moduleId: String(json.moduleId),
            editUIPosition: Number(json.editUIPosition),
        });
    }
}