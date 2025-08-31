import { JsonObj } from "~/core/types/Json";


export type TaxDetailProps = {
    amountMinor: number;
    items: TaxItem[];
}


export type TaxItemProps = {
    code: string;
    name: string;
    rate: number;
    amountMinor: number;
}


export class TaxItem {

    code: string;
    name: string;
    rate: number;
    amountMinor: number;

    constructor(props: TaxItemProps) {
        this.code = props.code;
        this.name = props.name;
        this.rate = props.rate;
        this.amountMinor = props.amountMinor;
    }

    static fromJson(json: JsonObj): TaxItem {
        return new TaxItem({
            code: json.code,
            name: json.name,
            rate: json.rate,
            amountMinor: json.amountMinor
        });
    }

}


export class TaxDetail {
    amountMinor: number;
    items: TaxItem[];

    constructor(props: TaxDetailProps) {
        this.amountMinor = props.amountMinor;
        this.items = props.items.map(item => new TaxItem(item));
    }

    static fromJson(json: JsonObj): TaxDetail {
        return new TaxDetail({
            amountMinor: json.amountMinor,
            items: json.items.map((item: JsonObj) => TaxItem.fromJson(item))
        });
    }
}
