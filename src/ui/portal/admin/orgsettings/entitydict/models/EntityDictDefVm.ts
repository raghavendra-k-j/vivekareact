import { EntityDictDef } from "~/domain/orgsettings/models/EntityDictDef";
import { InputValue } from "~/ui/widgets/form/InputValue";
import { validateEntityDicName } from "../validation_utils";

export class EntityDictDefVm {
    
    base: EntityDictDef;
    nameSingularField: InputValue<string>;
    namePluralField: InputValue<string>;

    constructor({ entityDict }: { entityDict: EntityDictDef }) {
        this.base = entityDict;
        this.nameSingularField = new InputValue<string>(entityDict.nameSingular, {
            validator: (value) => validateEntityDicName({name: value, label: "Singular name"}),
        });
        this.namePluralField = new InputValue<string>(entityDict.namePlural, {
            validator: (value) => validateEntityDicName({name: value, label: "Plural name"}),
        });
    }

    resetToDefaults(): void {
        this.nameSingularField.set(this.base.defNameSingular);
        this.namePluralField.set(this.base.defNamePlural);
    }


}