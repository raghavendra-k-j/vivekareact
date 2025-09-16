import { JsonObj } from "~/core/types/Json";

export class UpdateEntityEntityDict {

    defId: string;
    nameSingular: string;
    namePlural: string;

    constructor(params: { defId: string; nameSingular: string; namePlural: string }) {
        this.defId = params.defId;
        this.nameSingular = params.nameSingular;
        this.namePlural = params.namePlural;
    }

    toJson(): JsonObj {
        return {
            defId: this.defId,
            nameSingular: this.nameSingular,
            namePlural: this.namePlural,
        };
    }
}

export class UpdateEntityCatalogReq {
    entities: UpdateEntityEntityDict[];

    constructor(params: { entities: UpdateEntityEntityDict[] }) {
        this.entities = params.entities;
    }

    toJson(): JsonObj {
        return {
            entities: this.entities.map((e) => e.toJson()),
        };
    }
}
