import { EntityModuleBase } from "~/domain/entitydict/models/EntityModuleBase";
import { EntityCatalogDetail, EntityModuleDetail } from "~/domain/orgsettings/models/EntityCatalogDetail";
import { EntityDictDefVm } from "./EntityDictDefVm";

export class EntityCatalogDetailVm {
    modules: EntityModuleDetailVm[];

    constructor({ modules }: { modules: EntityModuleDetailVm[] }) {
        this.modules = modules;
    }

    static fromModel(res: EntityCatalogDetail): EntityCatalogDetailVm {
        const modules = res.modules.map((module) => EntityModuleDetailVm.fromModel(module));
        modules.sort((a, b) => a.editUIPosition - b.editUIPosition);
        return new EntityCatalogDetailVm({ modules });
    }
}

export class EntityModuleDetailVm {
    base: EntityModuleBase;
    description: string;
    editUIPosition: number;
    entities: EntityDictDefVm[];

    constructor(params: {
        base: EntityModuleBase;
        description: string;
        editUIPosition: number;
        entities: EntityDictDefVm[];
    }) {
        this.base = params.base;
        this.description = params.description;
        this.editUIPosition = params.editUIPosition;
        this.entities = params.entities;
    }

    static fromModel(res: EntityModuleDetail): EntityModuleDetailVm {
        const entities = res.entities.map((e) => new EntityDictDefVm({ entityDict: e }));
        entities.sort((a, b) => a.base.editUIPosition - b.base.editUIPosition);
        return new EntityModuleDetailVm({
            base: res.base,
            description: res.description,
            editUIPosition: res.editUIPosition,
            entities,
        });
    }
}