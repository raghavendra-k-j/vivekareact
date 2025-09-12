import { JsonObj } from "~/core/types/Json";

export interface EntityModuleParams {
    id: string;
    nameSingular: string;
    namePlural: string;
}

export class EntityModule {
    id: string;
    nameSingular: string;
    namePlural: string;
    constructor(params: EntityModuleParams) {
        this.id = params.id;
        this.nameSingular = params.nameSingular;
        this.namePlural = params.namePlural;
    }

    static fromJson(json: JsonObj): EntityModule {
        return new EntityModule({
            id: json.id,
            nameSingular: json.nameSingular,
            namePlural: json.namePlural,
        });
    }
}