import { InputValue } from "./InputValue";

export class InputValuesUtil {

    static hasError(fields: InputValue<any>[]): boolean {
        return fields.some(field => field.error !== undefined);
    }

}