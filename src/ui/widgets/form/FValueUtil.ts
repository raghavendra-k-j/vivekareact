import { FValue } from "./FValue";

export class FValueUtil {

    static hasError(fields: FValue<any>[]): boolean {
        return fields.some(field => field.error !== undefined);
    }
    
}