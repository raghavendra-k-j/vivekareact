import { InputValue } from "./InputValue";

export class InputValuesUtil {

    static hasError(fields: InputValue<any>[]): boolean {
        return fields.some(field => field.error !== undefined);
    }

    static validateAll(fields: InputValue<any>[]): boolean {
        fields.forEach(field => field.validate());
        return !this.hasError(fields);
    }

}