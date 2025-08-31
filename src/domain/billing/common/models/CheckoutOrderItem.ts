import { JsonObj } from "~/core/types/Json";
import { ProductType } from "./ProductType";
import { TaxDetail } from "./TaxDetail";


export type CheckoutOrderItemProps = {
    productType: ProductType;
    priceId: number;
    displayName: string;
    quantity: number;
    unitAmountMinor: number;
    subtotalAmountMinor: number;
    taxDetail: TaxDetail | null;
    totalAmountMinor: number | null;
    itemSnapshot: Map<string, object> | null;
    amountMetadata: Map<string, object> | null;
}


export class CheckoutOrderItem {

    productType: ProductType;
    priceId: number;
    displayName: string;
    quantity: number;
    unitAmountMinor: number;
    subtotalAmountMinor: number;
    taxDetail: TaxDetail | null;
    totalAmountMinor: number | null;
    itemSnapshot: Map<string, object> | null;
    amountMetadata: Map<string, object> | null;

    constructor(props: CheckoutOrderItemProps) {
        this.productType = props.productType;
        this.priceId = props.priceId;
        this.displayName = props.displayName;
        this.quantity = props.quantity;
        this.unitAmountMinor = props.unitAmountMinor;
        this.subtotalAmountMinor = props.subtotalAmountMinor;
        this.taxDetail = props.taxDetail;
        this.totalAmountMinor = props.totalAmountMinor;
        this.itemSnapshot = props.itemSnapshot;
        this.amountMetadata = props.amountMetadata;
    }

    static fromJson(json: JsonObj): CheckoutOrderItem {
        return new CheckoutOrderItem({
            productType: ProductType.fromValue(json.productType),
            priceId: json.priceId,
            displayName: json.displayName,
            quantity: json.quantity,
            unitAmountMinor: json.unitAmountMinor,
            subtotalAmountMinor: json.subtotalAmountMinor,
            taxDetail: json.taxDetail ? TaxDetail.fromJson(json.taxDetail) : null,
            totalAmountMinor: json.totalAmountMinor,
            itemSnapshot: json.itemSnapshot,
            amountMetadata: json.amountMetadata,
        });
    }

}
