import { JsonObj } from "~/core/types/Json";

export type CurrencyProps = {
    code: string;
    name: string;
    symbol: string;
    minorUnit: number;
}

export class Currency {

    readonly code: string;
    readonly name: string;
    readonly symbol: string;
    readonly minorUnit: number;

    constructor(props: CurrencyProps) {
        this.code = props.code;
        this.name = props.name;
        this.symbol = props.symbol;
        this.minorUnit = props.minorUnit;
    }

    static fromJson(json: JsonObj): Currency {
        return new Currency({
            code: json.code,
            name: json.name,
            symbol: json.symbol,
            minorUnit: json.minorUnit,
        });
    }
    
}