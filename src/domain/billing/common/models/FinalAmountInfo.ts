import { JsonObj } from "~/core/types/Json";
import { Currency } from "~/domain/common/models/Currency";
import { TaxDetail } from "./TaxDetail";


export type FinalAmountInfoProps = {
    currency: Currency;
    taxDetail: TaxDetail;
    totalAmountMinor: number;
}


export class FinalAmountInfo {

    currency: Currency;
    taxDetail: TaxDetail;
    totalAmountMinor: number;

    constructor(props: FinalAmountInfoProps) {
        this.currency = props.currency;
        this.taxDetail = props.taxDetail;
        this.totalAmountMinor = props.totalAmountMinor;
    }

    static fromJson(json: JsonObj): FinalAmountInfo {
        return new FinalAmountInfo({
            currency: Currency.fromJson(json.currency),
            taxDetail: TaxDetail.fromJson(json.taxDetail),
            totalAmountMinor: json.totalAmountMinor
        });
    }

}