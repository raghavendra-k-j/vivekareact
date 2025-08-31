import { JsonObj } from "~/core/types/Json";

export type CheckoutAmountProps = {
    isTaxCalculated: boolean;
    subtotalAmountMinor: number;
    taxAmountMinor: number | null;
    totalAmountMinor: number | null;
}

export class CheckoutAmount {
    public readonly isTaxCalculated: boolean;
    public readonly subtotalAmountMinor: number;
    public readonly taxAmountMinor: number | null;
    public readonly totalAmountMinor: number | null;

    constructor(props: CheckoutAmountProps) {
        this.isTaxCalculated = props.isTaxCalculated;
        this.subtotalAmountMinor = props.subtotalAmountMinor;
        this.taxAmountMinor = props.taxAmountMinor;
        this.totalAmountMinor = props.totalAmountMinor;
    }

    static fromJson(json: JsonObj): CheckoutAmount {
        return new CheckoutAmount({
            isTaxCalculated: json.isTaxCalculated,
            subtotalAmountMinor: json.subtotalAmountMinor,
            taxAmountMinor: json.taxAmountMinor,
            totalAmountMinor: json.totalAmountMinor,
        });
    }

}